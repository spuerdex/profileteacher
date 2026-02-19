'use client';

import { useI18n } from '@/lib/i18n';
import { useState } from 'react';

export default function ActivityModal({
    showModal,
    setShowModal,
    editing,
    formData,
    handleChange,
    handleSubmit
}) {
    const { t } = useI18n();
    const [showEnglish, setShowEnglish] = useState(false);

    if (!showModal) return null;

    return (
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
    );
}
