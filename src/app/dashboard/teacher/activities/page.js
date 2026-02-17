'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useI18n } from '@/lib/i18n';
import styles from '../research/crud.module.css';

export default function TeacherActivitiesPage() {
    const { data: session } = useSession();
    const { t } = useI18n();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({ titleTh: '', titleEn: '', descriptionTh: '', descriptionEn: '', date: '', type: '' });

    const fetchItems = useCallback(async () => {
        if (!session?.user?.teacherId) return;
        try { const res = await fetch(`/api/activities?teacherId=${session.user.teacherId}`); setItems(await res.json()); } catch { } finally { setLoading(false); }
    }, [session]);

    useEffect(() => { fetchItems(); }, [fetchItems]);

    const showToast = (type, msg) => { setToast({ type, message: msg }); setTimeout(() => setToast(null), 3000); };
    const resetForm = () => { setFormData({ titleTh: '', titleEn: '', descriptionTh: '', descriptionEn: '', date: '', type: '' }); setEditing(null); };
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleOpenAdd = () => { resetForm(); setShowModal(true); };
    const handleOpenEdit = (item) => {
        setFormData({
            titleTh: item.titleTh || '', titleEn: item.titleEn || '', descriptionTh: item.descriptionTh || '',
            descriptionEn: item.descriptionEn || '', date: item.date ? item.date.split('T')[0] : '', type: item.type || '',
        });
        setEditing(item); setShowModal(true);
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

    if (loading) return <div className="loading-center"><div className="spinner spinner-lg"></div></div>;

    return (
        <div>
            <div className="page-header">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="page-title">📋 {t('activities.title')}</h1>
                        <p className="page-subtitle">{t('activities.subtitle')}</p>
                    </div>
                    <button className="btn btn-primary" onClick={handleOpenAdd}>➕ {t('activities.add')}</button>
                </div>
            </div>

            <div className={styles.itemsList}>
                {items.map((item) => (
                    <div key={item.id} className={styles.itemCard}>
                        <div className={styles.itemHeader}>
                            <h3 className={styles.itemTitle}>{item.titleTh}</h3>
                            <div className="flex gap-sm">
                                <button className="btn btn-ghost btn-sm" onClick={() => handleOpenEdit(item)}>✏️</button>
                                <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(item.id)}>🗑️</button>
                            </div>
                        </div>
                        {item.titleEn && <p className={styles.itemSub}>{item.titleEn}</p>}
                        <div className={styles.itemMeta}>
                            {item.date && <span className="badge badge-primary">{new Date(item.date).toLocaleDateString('th-TH')}</span>}
                            {item.type && <span className="badge">{item.type}</span>}
                        </div>
                        {item.descriptionTh && <p className={styles.itemDesc}>{item.descriptionTh}</p>}
                    </div>
                ))}
                {items.length === 0 && <div className={styles.empty}><p>📋</p><p>ยังไม่มีกิจกรรม</p><button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>เพิ่มกิจกรรม</button></div>}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">{editing ? '✏️ แก้ไขกิจกรรม' : '➕ เพิ่มกิจกรรม'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group"><label className="form-label">ชื่อกิจกรรม (TH) *</label><input className="form-input" name="titleTh" value={formData.titleTh} onChange={handleChange} required /></div>
                            <div className="form-group"><label className="form-label">Activity Name (EN)</label><input className="form-input" name="titleEn" value={formData.titleEn} onChange={handleChange} /></div>
                            <div className="grid grid-2">
                                <div className="form-group"><label className="form-label">วันที่</label><input className="form-input" type="date" name="date" value={formData.date} onChange={handleChange} /></div>
                                <div className="form-group"><label className="form-label">ประเภท</label>
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
                            <div className="form-group"><label className="form-label">รายละเอียด (TH)</label><textarea className="form-textarea" name="descriptionTh" value={formData.descriptionTh} onChange={handleChange} rows={3} /></div>
                            <div className="form-group"><label className="form-label">Description (EN)</label><textarea className="form-textarea" name="descriptionEn" value={formData.descriptionEn} onChange={handleChange} rows={3} /></div>
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
