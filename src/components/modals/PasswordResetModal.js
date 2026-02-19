'use client';

export default function PasswordResetModal({
    showPasswordModal,
    setShowPasswordModal,
    resetPasswordTeacher,
    newPassword,
    setNewPassword,
    handleResetPassword
}) {
    if (!showPasswordModal) return null;

    return (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                <div className="modal-header">
                    <h3 className="modal-title">🔑 รีเซ็ตรหัสผ่าน</h3>
                    <button className="modal-close" onClick={() => setShowPasswordModal(false)}>✕</button>
                </div>
                <div style={{ padding: '0 24px 24px' }}>
                    <p className="mb-md">
                        กำลังเปลี่ยนรหัสผ่านสำหรับ: <strong>{resetPasswordTeacher?.firstNameTh} {resetPasswordTeacher?.lastNameTh}</strong>
                    </p>
                    <form onSubmit={handleResetPassword}>
                        <div className="form-group">
                            <label className="form-label">รหัสผ่านใหม่ *</label>
                            <input
                                className="form-input"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="ตั้งรหัสผ่านใหม่"
                                required
                                minLength={4}
                            />
                        </div>
                        <div className="flex justify-end gap-sm mt-lg">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>ยกเลิก</button>
                            <button type="submit" className="btn btn-primary">บันทึก</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
