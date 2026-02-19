'use client';

import { useI18n } from '@/lib/i18n';
import styles from './modals.module.css';

export default function TeacherManagementModal({
    showModal,
    setShowModal,
    editingTeacher,
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
                    <h3 className="modal-title">
                        {editingTeacher ? '✏️ แก้ไขอาจารย์' : '➕ เพิ่มอาจารย์ใหม่'}
                    </h3>
                    <button className="modal-close" onClick={() => setShowModal(false)}>
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGrid}>
                        <div className="form-group">
                            <label className="form-label">คำนำหน้า (TH)</label>
                            <input className="form-input" name="titleTh" value={formData.titleTh} onChange={handleChange} placeholder="ผศ.ดร." />
                        </div>
                        <div className="form-group">
                            <label className="form-label">คำนำหน้า (EN)</label>
                            <input className="form-input" name="titleEn" value={formData.titleEn} onChange={handleChange} placeholder="Asst. Prof. Dr." />
                        </div>
                        <div className="form-group">
                            <label className="form-label">ชื่อ (TH) *</label>
                            <input className="form-input" name="firstNameTh" value={formData.firstNameTh} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">นามสกุล (TH) *</label>
                            <input className="form-input" name="lastNameTh" value={formData.lastNameTh} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">First Name (EN)</label>
                            <input className="form-input" name="firstNameEn" value={formData.firstNameEn} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Last Name (EN)</label>
                            <input className="form-input" name="lastNameEn" value={formData.lastNameEn} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">ตำแหน่งวิชาการ</label>
                            <input className="form-input" name="position" value={formData.position} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">สาขา/ภาควิชา</label>
                            <input className="form-input" name="department" value={formData.department} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">อีเมล</label>
                            <input className="form-input" type="email" name="email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">โทรศัพท์</label>
                            <input className="form-input" name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                        {!editingTeacher && (
                            <>
                                <div className="form-group">
                                    <label className="form-label">ชื่อผู้ใช้ (Login) *</label>
                                    <input className="form-input" name="username" value={formData.username} onChange={handleChange} placeholder="username" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">รหัสผ่าน *</label>
                                    <input className="form-input" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                            {t('common.cancel')}
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {t('common.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
