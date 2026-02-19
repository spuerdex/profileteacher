'use client';

import { useI18n } from '@/lib/i18n';

export default function ArticleModal({
    showModal,
    setShowModal,
    editing,
    formData,
    handleChange,
    handleImageUpload,
    uploading,
    handleSubmit
}) {
    const { t } = useI18n();

    if (!showModal) return null;

    return (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">{editing ? '✏️ แก้ไขบทความ' : '➕ เขียนบทความใหม่'}</h3>
                    <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">{t('articles.postTitle')} *</label>
                        <input className="form-input" name="title" value={formData.title} onChange={handleChange} required placeholder="หัวข้อเรื่อง..." />
                    </div>

                    <div className="form-group">
                        <label className="form-label">{t('articles.coverImage')}</label>
                        <div className="flex gap-md items-center">
                            {formData.coverImage && (
                                <img src={formData.coverImage} alt="Preview" style={{ height: '80px', borderRadius: '8px' }} />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="form-input"
                                style={{ width: 'auto' }}
                            />
                            {uploading && <span className="spinner"></span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">{t('articles.content')} *</label>
                        <textarea
                            className="form-textarea"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            rows={10}
                            placeholder="เขียนเนื้อหาที่นี่..."
                        ></textarea>
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
