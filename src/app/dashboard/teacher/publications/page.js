'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useI18n } from '@/lib/i18n';
import styles from '../research/crud.module.css';

export default function TeacherPublicationsPage() {
    const { data: session } = useSession();
    const { t } = useI18n();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({ titleTh: '', titleEn: '', journal: '', year: '', link: '' });

    const fetchItems = useCallback(async () => {
        if (!session?.user?.teacherId) return;
        try { const res = await fetch(`/api/publications?teacherId=${session.user.teacherId}`); setItems(await res.json()); } catch { } finally { setLoading(false); }
    }, [session]);

    useEffect(() => { fetchItems(); }, [fetchItems]);

    const showToast = (type, msg) => { setToast({ type, message: msg }); setTimeout(() => setToast(null), 3000); };
    const resetForm = () => { setFormData({ titleTh: '', titleEn: '', journal: '', year: '', link: '' }); setEditing(null); };
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleOpenAdd = () => { resetForm(); setShowModal(true); };
    const handleOpenEdit = (item) => {
        setFormData({ titleTh: item.titleTh || '', titleEn: item.titleEn || '', journal: item.journal || '', year: item.year || '', link: item.link || '' });
        setEditing(item); setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editing ? `/api/publications/${editing.id}` : '/api/publications';
            const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
            if (res.ok) { showToast('success', editing ? 'อัปเดตสำเร็จ!' : 'เพิ่มสำเร็จ!'); setShowModal(false); resetForm(); fetchItems(); }
            else showToast('error', 'เกิดข้อผิดพลาด');
        } catch { showToast('error', 'เกิดข้อผิดพลาด'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('ยืนยันการลบ?')) return;
        try { const res = await fetch(`/api/publications/${id}`, { method: 'DELETE' }); if (res.ok) { showToast('success', 'ลบสำเร็จ!'); fetchItems(); } } catch { }
    };

    if (loading) return <div className="loading-center"><div className="spinner spinner-lg"></div></div>;

    return (
        <div>
            <div className="page-header">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="page-title">📄 {t('publications.title')}</h1>
                        <p className="page-subtitle">{t('publications.subtitle')}</p>
                    </div>
                    <button className="btn btn-primary" onClick={handleOpenAdd}>➕ {t('publications.add')}</button>
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
                            {item.journal && <span className="badge">{item.journal}</span>}
                            {item.year && <span className="badge badge-primary">{item.year}</span>}
                        </div>
                        {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className={styles.itemLink}>🔗 ลิงก์</a>}
                    </div>
                ))}
                {items.length === 0 && <div className={styles.empty}><p>📄</p><p>ยังไม่มีผลงานตีพิมพ์</p><button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>เพิ่มผลงาน</button></div>}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">{editing ? '✏️ แก้ไขผลงาน' : '➕ เพิ่มผลงาน'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group"><label className="form-label">ชื่อผลงาน (TH) *</label><input className="form-input" name="titleTh" value={formData.titleTh} onChange={handleChange} required /></div>
                            <div className="form-group"><label className="form-label">Title (EN)</label><input className="form-input" name="titleEn" value={formData.titleEn} onChange={handleChange} /></div>
                            <div className="grid grid-2">
                                <div className="form-group"><label className="form-label">วารสาร/สิ่งพิมพ์</label><input className="form-input" name="journal" value={formData.journal} onChange={handleChange} /></div>
                                <div className="form-group"><label className="form-label">ปี</label><input className="form-input" type="number" name="year" value={formData.year} onChange={handleChange} /></div>
                            </div>
                            <div className="form-group"><label className="form-label">🔗 ลิงก์</label><input className="form-input" name="link" value={formData.link} onChange={handleChange} placeholder="https://..." /></div>
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
