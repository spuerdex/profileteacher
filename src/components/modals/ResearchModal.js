'use client';

import { useI18n } from '@/lib/i18n';
import { useState } from 'react';

export default function ResearchModal({
    showModal,
    setShowModal,
    editing,
    formData,
    showEnglish,
    setShowEnglish,
    handleChange,
    handleSubmit
}) {
    const { t } = useI18n();

    if (!showModal) return null;

    return (
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
                            <label className="form-label">{t('research.titleLabel')} (EN)</label>
                            <input className="form-input" name="titleEn" value={formData.titleEn} onChange={handleChange} />
                        </div>
                    )}

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

                    {showEnglish && (
                        <div className="form-group fade-in">
                            <label className="form-label">{t('research.abstract')} (EN)</label>
                            <textarea className="form-textarea" name="abstractEn" value={formData.abstractEn} onChange={handleChange} rows={3} />
                        </div>
                    )}

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
    );
}
