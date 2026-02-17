'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useI18n } from '@/lib/i18n';
import styles from '../research/crud.module.css';

export default function TeacherCoursesPage() {
    const { data: session } = useSession();
    const { t } = useI18n();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({ codeNumber: '', nameTh: '', nameEn: '', semester: '' });

    const fetchItems = useCallback(async () => {
        if (!session?.user?.teacherId) return;
        try { const res = await fetch(`/api/courses?teacherId=${session.user.teacherId}`); setItems(await res.json()); } catch { } finally { setLoading(false); }
    }, [session]);

    useEffect(() => { fetchItems(); }, [fetchItems]);

    const showToast = (type, msg) => { setToast({ type, message: msg }); setTimeout(() => setToast(null), 3000); };
    const resetForm = () => { setFormData({ codeNumber: '', nameTh: '', nameEn: '', semester: '' }); setEditing(null); };
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleOpenAdd = () => { resetForm(); setShowModal(true); };
    const handleOpenEdit = (item) => {
        setFormData({ codeNumber: item.codeNumber || '', nameTh: item.nameTh || '', nameEn: item.nameEn || '', semester: item.semester || '' });
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
                    <button className="btn btn-primary" onClick={handleOpenAdd}>➕ {t('courses.add')}</button>
                </div>
            </div>

            <div className={styles.itemsList}>
                {items.map((item) => (
                    <div key={item.id} className={styles.itemCard}>
                        <div className={styles.itemHeader}>
                            <div>
                                {item.codeNumber && <span className="badge badge-primary" style={{ marginBottom: '4px', display: 'inline-block' }}>{item.codeNumber}</span>}
                                <h3 className={styles.itemTitle}>{item.nameTh}</h3>
                            </div>
                            <div className="flex gap-sm">
                                <button className="btn btn-ghost btn-sm" onClick={() => handleOpenEdit(item)}>✏️</button>
                                <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(item.id)}>🗑️</button>
                            </div>
                        </div>
                        {item.nameEn && <p className={styles.itemSub}>{item.nameEn}</p>}
                        <div className={styles.itemMeta}>
                            {item.semester && <span className="badge">{item.semester}</span>}
                        </div>
                    </div>
                ))}
                {items.length === 0 && <div className={styles.empty}><p>📚</p><p>ยังไม่มีวิชาที่สอน</p><button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>เพิ่มวิชา</button></div>}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">{editing ? '✏️ แก้ไขรายวิชา' : '➕ เพิ่มรายวิชา'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group"><label className="form-label">รหัสวิชา</label><input className="form-input" name="codeNumber" value={formData.codeNumber} onChange={handleChange} placeholder="CS101" /></div>
                            <div className="form-group"><label className="form-label">ชื่อวิชา (TH) *</label><input className="form-input" name="nameTh" value={formData.nameTh} onChange={handleChange} required /></div>
                            <div className="form-group"><label className="form-label">Course Name (EN)</label><input className="form-input" name="nameEn" value={formData.nameEn} onChange={handleChange} /></div>
                            <div className="form-group"><label className="form-label">ภาคเรียน</label><input className="form-input" name="semester" value={formData.semester} onChange={handleChange} placeholder="1/2568" /></div>
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
