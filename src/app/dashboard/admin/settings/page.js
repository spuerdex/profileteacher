'use client';

import { useState, useEffect } from 'react';
import styles from './settings.module.css';

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState({
        institutionNameTh: '',
        institutionNameEn: '',
        institutionLogo: '',
        contactEmail: '',
        contactPhone: '',
        footerText: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetch('/api/admin/settings')
            .then(r => r.json())
            .then(data => {
                setSettings(prev => ({ ...prev, ...data }));
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMsg('');
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            if (res.ok) {
                setMsg('✅ บันทึกสำเร็จ');
                setTimeout(() => setMsg(''), 3000);
            } else {
                setMsg('❌ เกิดข้อผิดพลาด');
            }
        } catch {
            setMsg('❌ เกิดข้อผิดพลาด');
        }
        setSaving(false);
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const fd = new FormData();
        fd.append('file', file);
        fd.append('type', 'logo');
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: fd });
            const { url } = await res.json();
            setSettings(prev => ({ ...prev, institutionLogo: url }));
        } catch {
            alert('อัปโหลดล้มเหลว');
        }
    };

    const update = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

    if (loading) return <div className="pageLoader">กำลังโหลด...</div>;

    return (
        <div>
            <div className="page-header">
                <div className="flex flex-col sm-flex-row items-start sm-items-center justify-between gap-md">
                    <div>
                        <h1 className="page-title">⚙️ ตั้งค่าระบบ</h1>
                        <p className="page-subtitle">จัดการข้อมูลสถาบันและการตั้งค่าทั่วไป</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <section className={styles.section}>
                    <h2>🏛️ ข้อมูลสถาบัน</h2>
                    <div className={styles.formGrid}>
                        <label className={styles.field}>
                            <span>ชื่อสถาบัน (ภาษาไทย)</span>
                            <input type="text" value={settings.institutionNameTh} onChange={(e) => update('institutionNameTh', e.target.value)} placeholder="มหาวิทยาลัย..." />
                        </label>
                        <label className={styles.field}>
                            <span>Institution Name (English)</span>
                            <input type="text" value={settings.institutionNameEn} onChange={(e) => update('institutionNameEn', e.target.value)} placeholder="University of..." />
                        </label>
                    </div>

                    <div className={styles.logoSection}>
                        <span className={styles.fieldLabel}>โลโก้สถาบัน</span>
                        <div className={styles.logoUpload}>
                            {settings.institutionLogo ? (
                                <img src={settings.institutionLogo} alt="Logo" className={styles.logoPreview} />
                            ) : (
                                <div className={styles.logoPlaceholder}>🏛️</div>
                            )}
                            <label className={styles.uploadBtn}>
                                📤 อัปโหลดโลโก้
                                <input type="file" accept="image/*" hidden onChange={handleLogoUpload} />
                            </label>
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2>📞 ข้อมูลติดต่อ</h2>
                    <div className={styles.formGrid}>
                        <label className={styles.field}>
                            <span>อีเมลติดต่อ</span>
                            <input type="email" value={settings.contactEmail} onChange={(e) => update('contactEmail', e.target.value)} placeholder="info@university.ac.th" />
                        </label>
                        <label className={styles.field}>
                            <span>เบอร์โทร</span>
                            <input type="text" value={settings.contactPhone} onChange={(e) => update('contactPhone', e.target.value)} placeholder="02-xxx-xxxx" />
                        </label>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2>📝 อื่นๆ</h2>
                    <label className={styles.field}>
                        <span>ข้อความ Footer</span>
                        <textarea value={settings.footerText} onChange={(e) => update('footerText', e.target.value)} rows={3} placeholder="© 2026 มหาวิทยาลัย..." />
                    </label>
                </section>

                <div className={styles.formFooter}>
                    {msg && <span className={styles.msg}>{msg}</span>}
                    <button type="submit" className={styles.saveBtn} disabled={saving}>
                        {saving ? '⏳ กำลังบันทึก...' : '💾 บันทึกการตั้งค่า'}
                    </button>
                </div>
            </form>
        </div>
    );
}
