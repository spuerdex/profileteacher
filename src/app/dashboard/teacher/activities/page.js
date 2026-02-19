'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useI18n } from '@/lib/i18n';
import styles from '../research/crud.module.css';

export default function TeacherActivitiesPage() {
    const { data: session } = useSession();
    const { t } = useI18n();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 5;

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({
        titleTh: '', titleEn: '', descriptionTh: '', descriptionEn: '', date: '', type: ''
    });

    const [showEnglish, setShowEnglish] = useState(false);
    const [search, setSearch] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchItems = useCallback(async () => {
        if (!session?.user?.teacherId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/activities?teacherId=${session.user.teacherId}&page=${page}&limit=${LIMIT}&search=${searchTerm}`);
            const data = await res.json();
            setItems(data.data || []);
            setTotalPages(data.meta?.totalPages || 1);
        } catch { } finally { setLoading(false); }
    }, [session, page, searchTerm]);

    useEffect(() => { fetchItems(); }, [fetchItems]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setSearchTerm(search);
    };

    const showToast = (type, msg) => { setToast({ type, message: msg }); setTimeout(() => setToast(null), 3000); };
    const resetForm = () => { setFormData({ titleTh: '', titleEn: '', descriptionTh: '', descriptionEn: '', date: '', type: '' }); setEditing(null); };
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleOpenAdd = () => {
        resetForm();
        setShowEnglish(false);
        setShowModal(true);
    };

    const handleOpenEdit = (item) => {
        setFormData({
            titleTh: item.titleTh || '', titleEn: item.titleEn || '',
            descriptionTh: item.descriptionTh || '', descriptionEn: item.descriptionEn || '',
            date: item.date ? item.date.split('T')[0] : '', type: item.type || '',
        });
        setEditing(item);
        if (item.titleEn || item.descriptionEn) {
            setShowEnglish(true);
        } else {
            setShowEnglish(false);
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editing ? `/api/activities/${editing.id}` : '/api/activities';
            const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
            if (res.ok) { showToast('success', editing ? 'อัปเดตสำเร็จ!' : 'เพิ่มสำเร็จ!'); setShowModal(false); resetForm(); fetchItems(); }
            else showToast('error', 'เกิดข้อผิดพลาด');
        } catch { showToast('error', 'เกิดข้อผิดพลาด'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('ยืนยันการลบ?')) return;
        try { const res = await fetch(`/api/activities/${id}`, { method: 'DELETE' }); if (res.ok) { showToast('success', 'ลบสำเร็จ!'); fetchItems(); } } catch { }
    };

    if (loading && items.length === 0) return <div className="loading-center"><div className="spinner spinner-lg"></div></div>;

    return (
        <div>
            <div className="page-header">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="page-title">📋 {t('activities.title')}</h1>
                        <p className="page-subtitle">{t('activities.subtitle')}</p>
                    </div>
                    <div className="flex gap-sm">
                        <form onSubmit={handleSearch} className="flex gap-sm">
                            <input
                                type="text"
                                placeholder={t('common.search') + "..."}
                                className="form-input"
                                style={{ width: '200px' }}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button type="submit" className="btn btn-secondary">🔍</button>
                        </form>
                        <button className="btn btn-primary" onClick={handleOpenAdd}>➕ {t('activities.add')}</button>
                    </div>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>{t('activities.activityTitle')}</th>
                            <th>{t('activities.date')}</th>
                            <th>{t('common.status')}</th>
                            <th>{t('common.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length > 0 ? (
                            items.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="font-medium">{item.titleTh}</div>
                                        {item.titleEn && <div className="text-sm text-muted">{item.titleEn}</div>}
                                    </td>
                                    <td>{item.date ? new Date(item.date).toLocaleDateString('th-TH') : '-'}</td>
                                    <td>
                                        {item.type && <span className="badge badge-sm">{item.type}</span>}
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
                                <td colSpan="4" className="text-center py-xl text-muted">
                                    <div className="mb-sm" style={{ fontSize: '2rem' }}>📋</div>
                                    <p>{t('common.noData')}</p>
                                    <button className="btn btn-primary btn-sm mt-md" onClick={handleOpenAdd}>{t('activities.add')}</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center mt-lg gap-sm">
                    <button
                        className="btn btn-secondary btn-sm"
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                    >
                        ← {t('common.back')}
                    </button>
                    <span className="flex items-center px-md text-sm text-secondary">
                        หน้าที่ {page} จาก {totalPages}
                    </span>
                    <button
                        className="btn btn-secondary btn-sm"
                        disabled={page === totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    >
                        {t('common.next')} →
                    </button>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">{editing ? '✏️ แก้ไขกิจกรรม' : '➕ เพิ่มกิจกรรม'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">{t('activities.activityTitle')} (TH) *</label>
                                <input className="form-input" name="titleTh" value={formData.titleTh} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <div className="flex items-center gap-sm mb-sm">
                                    <input
                                        type="checkbox"
                                        id="showEnglish"
                                        checked={showEnglish}
                                        onChange={(e) => setShowEnglish(e.target.checked)}
                                        style={{ width: 'auto', margin: 0 }}
                                    />
                                    <label htmlFor="showEnglish" style={{ cursor: 'pointer', userSelect: 'none' }}>
                                        เพิ่มข้อมูลภาษาอังกฤษ (Add English Data)
                                    </label>
                                </div>
                            </div>

                            {showEnglish && (
                                <div className="form-group fade-in">
                                    <label className="form-label">{t('activities.activityTitle')} (EN)</label>
                                    <input className="form-input" name="titleEn" value={formData.titleEn} onChange={handleChange} />
                                </div>
                            )}

                            <div className="grid grid-2">
                                <div className="form-group">
                                    <label className="form-label">{t('activities.date')}</label>
                                    <input className="form-input" type="date" name="date" value={formData.date} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t('common.status')}</label>
                                    <select className="form-input" name="type" value={formData.type} onChange={handleChange}>
                                        <option value="">เลือกประเภท</option>
                                        <option value="training">อบรม/สัมมนา</option>
                                        <option value="conference">ประชุมวิชาการ</option>
                                        <option value="community">บริการวิชาการ</option>
                                        <option value="committee">กรรมการ</option>
                                        <option value="other">อื่นๆ</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">{t('activities.description')} (TH)</label>
                                <textarea className="form-textarea" name="descriptionTh" value={formData.descriptionTh} onChange={handleChange} rows={3} />
                            </div>

                            {showEnglish && (
                                <div className="form-group fade-in">
                                    <label className="form-label">{t('activities.description')} (EN)</label>
                                    <textarea className="form-textarea" name="descriptionEn" value={formData.descriptionEn} onChange={handleChange} rows={3} />
                                </div>
                            )}

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
