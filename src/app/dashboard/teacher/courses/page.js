'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useI18n } from '@/lib/i18n';
import styles from '../research/crud.module.css';

export default function TeacherCoursesPage() {
    const { data: session } = useSession();
    const { t } = useI18n();
    const [items, setItems] = useState([]);
    const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({ codeNumber: '', nameTh: '', nameEn: '', semester: '', descriptionTh: '' });
    const LIMIT = 10;

    const fetchItems = useCallback(async () => {
        if (!session?.user?.teacherId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/courses?teacherId=${session.user.teacherId}&page=${page}&limit=${LIMIT}&search=${searchTerm}`);
            const result = await res.json();
            setItems(result.data || []);
            setMeta(result.meta || { total: 0, page: 1, limit: LIMIT, totalPages: 1 });
        } catch { } finally { setLoading(false); }
    }, [session, page, searchTerm]);

    useEffect(() => { fetchItems(); }, [fetchItems]);

    const showToast = (type, msg) => { setToast({ type, message: msg }); setTimeout(() => setToast(null), 3000); };
    const resetForm = () => { setFormData({ codeNumber: '', nameTh: '', nameEn: '', semester: '', descriptionTh: '' }); setEditing(null); };
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchTerm(search);
        setPage(1);
    };

    const handleOpenAdd = () => { resetForm(); setShowModal(true); };
    const handleOpenEdit = (item) => {
        setFormData({ codeNumber: item.codeNumber || '', nameTh: item.nameTh || '', nameEn: item.nameEn || '', semester: item.semester || '', descriptionTh: item.descriptionTh || '' });
        setEditing(item); setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editing ? `/api/courses/${editing.id}` : '/api/courses';
            const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
            if (res.ok) { showToast('success', editing ? 'อัปเดตสำเร็จ!' : 'เพิ่มสำเร็จ!'); setShowModal(false); resetForm(); fetchItems(); }
            else showToast('error', 'เกิดข้อผิดพลาด');
        } catch { showToast('error', 'เกิดข้อผิดพลาด'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('ยืนยันการลบ?')) return;
        try { const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' }); if (res.ok) { showToast('success', 'ลบสำเร็จ!'); fetchItems(); } } catch { }
    };

    if (loading) return <div className="loading-center"><div className="spinner spinner-lg"></div></div>;

    return (
        <div>
            <div className="page-header">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="page-title">📚 {t('courses.title')}</h1>
                        <p className="page-subtitle">{t('courses.subtitle')}</p>
                    </div>
                    <div className="flex items-center gap-sm">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                className="form-input"
                                placeholder="ค้นหารหัสวิชา, ชื่อวิชา..."
                                style={{ width: '240px' }}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button type="submit" className="btn btn-secondary">🔍</button>
                        </form>
                        <button className="btn btn-primary" onClick={handleOpenAdd}>➕ {t('courses.add')}</button>
                    </div>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>รหัสวิชา</th>
                            <th>ชื่อรายวิชา</th>
                            <th>ภาคเรียน</th>
                            <th>{t('common.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length > 0 ? (
                            items.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        {item.codeNumber ? <span className="badge badge-primary">{item.codeNumber}</span> : '-'}
                                    </td>
                                    <td>
                                        <div className="font-medium text-primary">{item.nameTh}</div>
                                        {item.nameEn && <div className="text-sm text-muted">{item.nameEn}</div>}
                                    </td>
                                    <td>
                                        <div>{item.semester || '-'}</div>
                                    </td>
                                    <td>
                                        <div className="flex gap-sm">
                                            <button className="btn btn-ghost btn-sm" onClick={() => handleOpenEdit(item)}>✏️</button>
                                            <button className="btn btn-ghost btn-sm text-error" onClick={() => handleDelete(item.id)}>🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className={styles.empty}>
                                    <p>📚</p>
                                    <p>ยังไม่มีวิชาที่สอน</p>
                                    <button className="btn btn-primary btn-sm mt-md" onClick={handleOpenAdd}>เพิ่มวิชา</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {meta.totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        className="btn btn-secondary btn-sm"
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                    >
                        ← {t('common.back')}
                    </button>
                    <span className="flex items-center px-md text-sm text-secondary">
                        {t('common.page')} {page} {t('common.of')} {meta.totalPages}
                    </span>
                    <button
                        className="btn btn-secondary btn-sm"
                        disabled={page === meta.totalPages}
                        onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                    >
                        {t('common.next')} →
                    </button>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">{editing ? '✏️ แก้ไขรายวิชา' : '➕ เพิ่มรายวิชา'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-2">
                                <div className="form-group">
                                    <label className="form-label">รหัสวิชา</label>
                                    <input className="form-input" name="codeNumber" value={formData.codeNumber} onChange={handleChange} placeholder="CS101" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">ภาคเรียน</label>
                                    <input className="form-input" name="semester" value={formData.semester} onChange={handleChange} placeholder="1/2568" />
                                </div>
                            </div>
                            <div className="form-group"><label className="form-label">ชื่อวิชา (TH) *</label><input className="form-input" name="nameTh" value={formData.nameTh} onChange={handleChange} required /></div>
                            <div className="form-group"><label className="form-label">Course Name (EN)</label><input className="form-input" name="nameEn" value={formData.nameEn} onChange={handleChange} /></div>
                            <div className="form-group">
                                <label className="form-label">คำอธิบายรายวิชา (TH)</label>
                                <textarea className="form-textarea" name="descriptionTh" value={formData.descriptionTh} onChange={handleChange} rows={3}></textarea>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>{t('common.cancel')}</button>
                                <button type="submit" className="btn btn-primary">{t('common.save')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {toast && <div className={`toast toast-${toast.type}`}>{toast.type === 'success' ? '✅' : '❌'} {toast.message}</div>}
        </div>
    );
}
