'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useI18n } from '@/lib/i18n';
import timelineStyles from './EducationTimeline.module.css';

export default function TeacherEducationPage() {
    const { data: session } = useSession();
    const { t } = useI18n();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({
        degree: '', field: '', institution: '', year: ''
    });

    const fetchItems = useCallback(async () => {
        if (!session?.user?.teacherId) return;
        try {
            const res = await fetch('/api/education');
            if (res.ok) setItems(await res.json());
        } catch { } finally { setLoading(false); }
    }, [session]);

    useEffect(() => { fetchItems(); }, [fetchItems]);

    const showToast = (type, msg) => { setToast({ type, message: msg }); setTimeout(() => setToast(null), 3000); };
    const resetForm = () => { setFormData({ degree: '', field: '', institution: '', year: '' }); setEditing(null); };

    const handleOpenAdd = () => { resetForm(); setShowModal(true); };
    const handleOpenEdit = (item) => {
        setFormData({
            degree: item.degree || '',
            field: item.field || '',
            institution: item.institution || '',
            year: item.year || '',
        });
        setEditing(item); setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editing ? `/api/education/${editing.id}` : '/api/education';
            const res = await fetch(url, {
                method: editing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                showToast('success', editing ? 'อัปเดตสำเร็จ!' : 'เพิ่มสำเร็จ!');
                setShowModal(false); resetForm(); fetchItems();
            } else {
                showToast('error', 'เกิดข้อผิดพลาด');
            }
        } catch { showToast('error', 'เกิดข้อผิดพลาด'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('ยืนยันการลบ?')) return;
        try {
            const res = await fetch(`/api/education/${id}`, { method: 'DELETE' });
            if (res.ok) { showToast('success', 'ลบสำเร็จ!'); fetchItems(); }
        } catch { }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    if (loading) return <div className="loading-center"><div className="spinner spinner-lg"></div></div>;

    return (
        <div>
            <div className="page-header">
                <div className="flex flex-col sm-flex-row items-start sm-items-center justify-between gap-md">
                    <div>
                        <h1 className="page-title">🎓 {t('education.title')}</h1>
                        <p className="page-subtitle">{t('education.subtitle')}</p>
                    </div>
                    <button className="btn btn-primary xs-w-full sm-w-auto" onClick={handleOpenAdd}>➕ {t('education.addNew')}</button>
                </div>
            </div>

            <div className={timelineStyles.timelineContainer}>
                <div className={timelineStyles.timeline}>
                    {items.sort((a, b) => b.year - a.year).map((item) => (
                        <div key={item.id} className={timelineStyles.timelineItem}>
                            <div className={timelineStyles.timelineDot}></div>
                            <div className={timelineStyles.timelineContent}>
                                <div className={timelineStyles.timelineHeader}>
                                    <h3 className={timelineStyles.timelineDegree}>{item.degree}</h3>
                                    <div className={timelineStyles.timelineActions}>
                                        <button className="btn btn-ghost btn-sm" onClick={() => handleOpenEdit(item)}>✏️</button>
                                        <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(item.id)}>🗑️</button>
                                    </div>
                                </div>
                                {item.field && <p className={timelineStyles.timelineField}>{item.field}</p>}
                                <div className={timelineStyles.timelineMeta}>
                                    <span className={timelineStyles.timelineYear}>{item.year}</span>
                                    {item.institution && <span className={timelineStyles.timelineInstitution}>{item.institution}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className={timelineStyles.emptyTimeline}>
                            <p>🎓</p>
                            <p>{t('common.noData')}</p>
                            <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>{t('education.addNew')}</button>
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">{editing ? '✏️ ' + t('common.edit') : '➕ ' + t('education.addNew')}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">{t('education.degree')} *</label>
                                <input className="form-input" name="degree" value={formData.degree} onChange={handleChange} required placeholder="เช่น Ph.D., วท.บ." />
                            </div>
                            <div className="form-group">
                                <label className="form-label">{t('education.field')}</label>
                                <input className="form-input" name="field" value={formData.field} onChange={handleChange} placeholder="สาขาวิชา" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">{t('education.institution')}</label>
                                <input className="form-input" name="institution" value={formData.institution} onChange={handleChange} placeholder="ชื่อสถาบัน" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">{t('education.year')} (ค.ศ.) *</label>
                                <input className="form-input" type="number" name="year" value={formData.year} onChange={handleChange} required placeholder="เช่น 2024" />
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
