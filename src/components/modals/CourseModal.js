'use client';

import { useI18n } from '@/lib/i18n';

export default function CourseModal({
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
                    <h3 className="modal-title">{editing ? '✏️ ' + t('common.edit') : '➕ ' + t('courses.addNew')}</h3>
                    <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">รหัสวิชา *</label>
                        <input className="form-input" name="code" value={formData.code} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">ชื่อวิชา (TH) *</label>
                        <input className="form-input" name="nameTh" value={formData.nameTh} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Course Name (EN)</label>
                        <input className="form-input" name="nameEn" value={formData.nameEn} onChange={handleChange} />
                    </div>
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
    );
}
