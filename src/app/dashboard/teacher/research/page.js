'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useI18n } from '@/lib/i18n';
import styles from './crud.module.css';

export default function TeacherResearchPage() {
    const { data: session } = useSession();
    const { t } = useI18n();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({
        titleTh: '', titleEn: '', abstractTh: '', abstractEn: '',
        year: '', type: '', link: '',
    });

    const fetchItems = useCallback(async () => {
        if (!session?.user?.teacherId) return;
        try {
            const res = await fetch(`/api/research?teacherId=${session.user.teacherId}&limit=100`);
            const data = await res.json();
            setItems(data.data || []);
        } catch { } finally { setLoading(false); }
    }, [session]);

    useEffect(() => { fetchItems(); }, [fetchItems]);

    const showToast = (type, msg) => { setToast({ type, message: msg }); setTimeout(() => setToast(null), 3000); };
    const resetForm = () => { setFormData({ titleTh: '', titleEn: '', abstractTh: '', abstractEn: '', year: '', type: '', link: '' }); setEditing(null); };

    const handleOpenAdd = () => { resetForm(); setShowModal(true); };
    const handleOpenEdit = (item) => {
        setFormData({ titleTh: item.titleTh || '', titleEn: item.titleEn || '', abstractTh: item.abstractTh || '', abstractEn: item.abstractEn || '', year: item.year || '', type: item.type || '', link: item.link || '' });
        setEditing(item); setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editing ? `/api/research/${editing.id}` : '/api/research';
            const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
            if (res.ok) { showToast('success', editing ? 'อัปเดตสำเร็จ!' : 'เพิ่มสำเร็จ!'); setShowModal(false); resetForm(); fetchItems(); }
            else showToast('error', 'เกิดข้อผิดพลาด');
        } catch { showToast('error', 'เกิดข้อผิดพลาด'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('ยืนยันการลบ?')) return;
        try { const res = await fetch(`/api/research/${id}`, { method: 'DELETE' }); if (res.ok) { showToast('success', 'ลบสำเร็จ!'); fetchItems(); } } catch { }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    if (loading) return <div className="loading-center"><div className="spinner spinner-lg"></div></div>;

    return (
        <div>
            <div className="page-header">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="page-title">🔬 {t('research.title')}</h1>
                        <p className="page-subtitle">{t('research.subtitle')}</p>
                    </div>
                    <button className="btn btn-primary" onClick={handleOpenAdd}>➕ {t('research.add')}</button>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>{t('research.titleLabel')}</th>
                            <th>{t('research.year')}</th>
                            <th>{t('research.type')}</th>
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
                                    <td>{item.year || '-'}</td>
                                    <td>
                                        {item.type && (
                                            <span className="badge badge-sm">
                                                {item.type === 'journal' ? 'บทความวิจัย' :
                                                    item.type === 'conference' ? 'บทความวิชาการ' :
                                                        item.type === 'book' ? 'หนังสือ' : item.type}
                                            </span>
                                        )}
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
                                    <div className="mb-sm" style={{ fontSize: '2rem' }}>🔬</div>
                                    <p>ยังไม่มีงานวิจัย</p>
                                    <button className="btn btn-primary btn-sm mt-md" onClick={handleOpenAdd}>เพิ่มงานวิจัย</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">{editing ? '✏️ แก้ไขงานวิจัย' : '➕ เพิ่มงานวิจัย'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">{t('research.titleLabel')} (TH) *</label>
                                <input className="form-input" name="titleTh" value={formData.titleTh} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">{t('research.titleLabel')} (EN)</label>
                                <input className="form-input" name="titleEn" value={formData.titleEn} onChange={handleChange} />
                            </div>
                            <div className="grid grid-2">
                                <div className="form-group">
                                    <label className="form-label">{t('research.year')}</label>
                                    <input className="form-input" type="number" name="year" value={formData.year} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t('research.type')}</label>
                                    <select className="form-input" name="type" value={formData.type} onChange={handleChange}>
                                        <option value="">เลือกประเภท</option>
                                        <option value="journal">บทความวิจัย</option>
                                        <option value="conference">บทความวิชาการ</option>
                                        <option value="book">หนังสือ/ตำรา</option>
                                        <option value="patent">สิทธิบัตร</option>
                                        <option value="other">อื่นๆ</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">{t('research.abstract')} (TH)</label>
                                <textarea className="form-textarea" name="abstractTh" value={formData.abstractTh} onChange={handleChange} rows={3} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">{t('research.abstract')} (EN)</label>
                                <textarea className="form-textarea" name="abstractEn" value={formData.abstractEn} onChange={handleChange} rows={3} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">🔗 {t('research.link')}</label>
                                <input className="form-input" name="link" value={formData.link} onChange={handleChange} placeholder="https://..." />
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
