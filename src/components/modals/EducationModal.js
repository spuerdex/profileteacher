'use client';

import { useI18n } from '@/lib/i18n';

export default function EducationModal({
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
    );
}
