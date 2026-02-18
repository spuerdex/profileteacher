'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useI18n } from '@/lib/i18n';
import styles from './settings.module.css';

export default function TeacherSettings() {
    const { data: session } = useSession();
    const { t } = useI18n();
    const [themes, setThemes] = useState([]);
    const [currentThemeId, setCurrentThemeId] = useState(null);
    const [heroImage, setHeroImage] = useState(null);
    const [avatarImage, setAvatarImage] = useState(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(null); // 'hero' | 'avatar' | null
    const [toast, setToast] = useState(null);
    const heroRef = useRef(null);
    const avatarRef = useRef(null);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [changingPassword, setChangingPassword] = useState(false);

    useEffect(() => {
        fetch('/api/themes').then(r => r.json()).then(setThemes).catch(() => { });
        if (session?.user?.teacherId) {
            fetch(`/api/teachers/${session.user.teacherId}`)
                .then(r => r.json())
                .then(data => {
                    setCurrentThemeId(data.themePresetId);
                    setHeroImage(data.heroImage);
                    setAvatarImage(data.avatar);
                })
                .catch(() => { });
        }
    }, [session]);

    const showToast = (type, msg) => { setToast({ type, message: msg }); setTimeout(() => setToast(null), 3000); };

    const handleSelectTheme = async (themeId) => {
        if (!session?.user?.teacherId) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/teachers/${session.user.teacherId}`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ themePresetId: themeId }),
            });
            if (res.ok) { setCurrentThemeId(themeId); showToast('success', 'บันทึกธีมสำเร็จ!'); }
            else showToast('error', 'ไม่สามารถบันทึกได้');
        } catch { showToast('error', 'เกิดข้อผิดพลาด'); }
        finally { setSaving(false); }
    };

    const handleUpload = async (file, type) => {
        if (!file || !session?.user?.teacherId) return;
        setUploading(type);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type);

            const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
            if (!uploadRes.ok) { showToast('error', 'อัปโหลดไม่สำเร็จ'); return; }

            const { url } = await uploadRes.json();

            const updateData = type === 'hero' ? { heroImage: url } : { avatar: url };
            const res = await fetch(`/api/teachers/${session.user.teacherId}`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData),
            });

            if (res.ok) {
                if (type === 'hero') setHeroImage(url);
                else setAvatarImage(url);
                showToast('success', 'อัปโหลดสำเร็จ!');
            } else showToast('error', 'บันทึกไม่สำเร็จ');
        } catch { showToast('error', 'เกิดข้อผิดพลาด'); }
        finally { setUploading(null); }
    };

    const handleRemoveImage = async (type) => {
        if (!session?.user?.teacherId) return;
        if (!confirm('ต้องการลบรูปนี้?')) return;
        const updateData = type === 'hero' ? { heroImage: null } : { avatar: null };
        const res = await fetch(`/api/teachers/${session.user.teacherId}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData),
        });
        if (res.ok) {
            if (type === 'hero') setHeroImage(null);
            else setAvatarImage(null);
            showToast('success', 'ลบรูปสำเร็จ!');
        } else showToast('error', 'ไม่สามารถลบได้');
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showToast('error', 'รหัสผ่านใหม่ไม่ตรงกัน');
            return;
        }
        if (passwordData.newPassword.length < 4) {
            showToast('error', 'รหัสผ่านใหม่ต้องมีอย่างน้อย 4 ตัวอักษร');
            return;
        }
        setChangingPassword(true);
        try {
            const res = await fetch('/api/users/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                }),
            });
            const result = await res.json();
            if (res.ok) {
                showToast('success', 'เปลี่ยนรหัสผ่านสำเร็จ!');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                showToast('error', result.error || 'เกิดข้อผิดพลาด');
            }
        } catch {
            showToast('error', 'เกิดข้อผิดพลาด');
        } finally {
            setChangingPassword(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">⚙️ ตั้งค่า</h1>
                <p className="page-subtitle">จัดการธีมสีและรูปภาพโปรไฟล์</p>
            </div>

            {/* Image Upload Section */}
            <section className={styles.settingsSection}>
                <h2 className={styles.sectionTitle}>🖼️ รูปภาพ</h2>
                <div className={styles.imageGrid}>
                    {/* Avatar Upload */}
                    <div className={styles.imageUpload}>
                        <label className={styles.imageLabel}>รูปโปรไฟล์</label>
                        <div
                            className={styles.imagePreview}
                            onClick={() => avatarRef.current?.click()}
                            style={{ width: '120px', height: '120px', borderRadius: '50%' }}
                        >
                            {avatarImage ? (
                                <img src={avatarImage} alt="Avatar" />
                            ) : (
                                <span className={styles.imagePlaceholder}>👤<br />คลิกเพื่ออัปโหลด</span>
                            )}
                            {uploading === 'avatar' && (
                                <div className={styles.uploadOverlay}><div className="spinner"></div></div>
                            )}
                        </div>
                        <input ref={avatarRef} type="file" accept="image/*" hidden onChange={(e) => handleUpload(e.target.files[0], 'avatar')} />
                        <p className={styles.imageHint}>แนะนำ 200×200px, ไม่เกิน 5MB</p>
                        {avatarImage && (
                            <button type="button" className={styles.removeBtn} onClick={() => handleRemoveImage('avatar')}>🗑️ ลบรูปโปรไฟล์</button>
                        )}
                    </div>

                    {/* Hero Image Upload */}
                    <div className={styles.imageUpload}>
                        <label className={styles.imageLabel}>รูป Hero (แบนเนอร์)</label>
                        <div
                            className={styles.imagePreview}
                            onClick={() => heroRef.current?.click()}
                            style={{ width: '100%', height: '160px', borderRadius: 'var(--radius-lg)' }}
                        >
                            {heroImage ? (
                                <img src={heroImage} alt="Hero" style={{ objectPosition: 'center' }} />
                            ) : (
                                <span className={styles.imagePlaceholder}>🏞️<br />คลิกเพื่ออัปโหลดรูปแบนเนอร์</span>
                            )}
                            {uploading === 'hero' && (
                                <div className={styles.uploadOverlay}><div className="spinner"></div></div>
                            )}
                        </div>
                        <input ref={heroRef} type="file" accept="image/*" hidden onChange={(e) => handleUpload(e.target.files[0], 'hero')} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <p className={styles.imageHint} style={{ margin: 0 }}>แนะนำ 1200×400px, ไม่เกิน 5MB</p>
                            {heroImage && (
                                <button type="button" className={styles.removeBtn} onClick={() => handleRemoveImage('hero')}>🗑️ ลบรูป Hero</button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Theme Selection */}
            <section className={styles.settingsSection}>
                <h2 className={styles.sectionTitle}>🎨 {t('theme.title')}</h2>
                <p className="text-secondary text-sm mb-lg">{t('theme.subtitle')}</p>

                <div className={styles.themeGrid}>
                    {themes.map((theme) => (
                        <div
                            key={theme.id}
                            className={`${styles.themeCard} ${currentThemeId === theme.id ? styles.selected : ''}`}
                            onClick={() => handleSelectTheme(theme.id)}
                        >
                            <div className={styles.themePreview} style={{ background: theme.gradient || theme.primary }}>
                                <div className={styles.previewContent}>
                                    <div className={styles.previewHeader} style={{ background: theme.primaryDark }}></div>
                                    <div className={styles.previewBody}>
                                        <div className={styles.previewDot} style={{ background: theme.primary }}></div>
                                        <div className={styles.previewLine} style={{ background: theme.primaryLight }}></div>
                                        <div className={styles.previewLine2} style={{ background: theme.accent }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.themeInfo}>
                                <div className={styles.themeName}>{theme.name}</div>
                                <div className={styles.themeColors}>
                                    <span className={styles.colorDot} style={{ background: theme.primary }}></span>
                                    <span className={styles.colorDot} style={{ background: theme.primaryLight }}></span>
                                    <span className={styles.colorDot} style={{ background: theme.accent }}></span>
                                </div>
                            </div>
                            {currentThemeId === theme.id && (
                                <div className={styles.selectedBadge}>✓ {t('theme.current')}</div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Change Password */}
            <section className={styles.settingsSection}>
                <h2 className={styles.sectionTitle}>🔒 เปลี่ยนรหัสผ่าน</h2>
                <form onSubmit={handleChangePassword} className={styles.passwordForm}>
                    <div className="form-group">
                        <label className="form-label">รหัสผ่านปัจจุบัน</label>
                        <input className="form-input" type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">รหัสผ่านใหม่</label>
                        <input className="form-input" type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">ยืนยันรหัสผ่านใหม่</label>
                        <input className="form-input" type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={changingPassword}>
                        {changingPassword ? 'กำลังบันทึก...' : '🔐 เปลี่ยนรหัสผ่าน'}
                    </button>
                </form>
            </section>

            {saving && <div className="loading-center"><div className="spinner"></div></div>}
            {toast && <div className={`toast toast-${toast.type}`}>{toast.type === 'success' ? '✅' : '❌'} {toast.message}</div>}
        </div>
    );
}
