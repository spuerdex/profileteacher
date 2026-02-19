'use client';

import { useI18n } from '@/lib/i18n';

export default function PublicationModal({
    showModal,
    setShowModal,
    editing,
    formData,
    handleChange,
    handleSubmit
}) {
    const { t } = useI18n();

    if (!showModal) return null;

    return (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">{editing ? '✏️ แก้ไขผลงาน' : '➕ เพิ่มผลงาน'}</h3>
                    <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">ชื่อผลงาน (TH) *</label>
                        <input className="form-input" name="titleTh" value={formData.titleTh} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Title (EN)</label>
                        <input className="form-input" name="titleEn" value={formData.titleEn} onChange={handleChange} />
                    </div>
                    <div className="grid grid-2">
                        <div className="form-group">
                            <label className="form-label">วารสาร/สิ่งพิมพ์</label>
                            <input className="form-input" name="journal" value={formData.journal} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">ปี</label>
                            <input className="form-input" type="number" name="year" value={formData.year} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">DOI</label>
                        <input className="form-input" name="doi" value={formData.doi} onChange={handleChange} placeholder="10.xxxx/..." />
                    </div>
                    <div className="form-group">
                        <label className="form-label">🔗 ลิงก์</label>
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
