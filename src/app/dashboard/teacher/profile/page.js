'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useI18n } from '@/lib/i18n';

export default function TeacherProfilePage() {
    const { data: session } = useSession();
    const { t, locale } = useI18n();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({
        titleTh: '', firstNameTh: '', lastNameTh: '',
        position: '', department: '', email: '', phone: '',
        bioTh: '',
    });

    useEffect(() => {
        if (session?.user?.teacherId) {
            fetch(`/api/teachers/${session.user.teacherId}`)
                .then(res => res.json())
                .then(data => {
                    setFormData({
                        titleTh: data.titleTh || '', firstNameTh: data.firstNameTh || '', lastNameTh: data.lastNameTh || '',
                        position: data.position || '', department: data.department || '', email: data.email || '', phone: data.phone || '',
                        bioTh: data.bioTh || '',
                    });
                })
                .catch(() => { })
                .finally(() => setLoading(false));
        }
    }, [session]);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`/api/teachers/${session.user.teacherId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                showToast('success', 'บันทึกสำเร็จ!');
            } else {
                showToast('error', 'ไม่สามารถบันทึกได้');
            }
        } catch {
            showToast('error', 'เกิดข้อผิดพลาด');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="loading-center"><div className="spinner spinner-lg"></div></div>;
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">{t('profile.title')}</h1>
                <p className="page-subtitle">{t('profile.personalInfo')}</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="card mb-lg">
                    <div className="card-header">
                        <h3 className="card-title">🇹🇭 ข้อมูลภาษาไทย</h3>
                    </div>
                    <div className="grid grid-3">
                        <div className="form-group">
                            <label className="form-label">{t('profile.titlePrefix')}</label>
                            <input className="form-input" name="titleTh" value={formData.titleTh} onChange={handleChange} placeholder="ผศ.ดร." />
                        </div>
                        <div className="form-group">
                            <label className="form-label">{t('profile.firstName')} *</label>
                            <input className="form-input" name="firstNameTh" value={formData.firstNameTh} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">{t('profile.lastName')} *</label>
                            <input className="form-input" name="lastNameTh" value={formData.lastNameTh} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">{t('profile.bio')} (TH)</label>
                        <textarea className="form-textarea" name="bioTh" value={formData.bioTh} onChange={handleChange} rows={4} />
                    </div>
                </div>


                <div className="card mb-lg">
                    <div className="card-header">
                        <h3 className="card-title">📋 {t('profile.position')} & {t('profile.department')}</h3>
                    </div>
                    <div className="grid grid-2">
                        <div className="form-group">
                            <label className="form-label">{t('profile.position')}</label>
                            <input className="form-input" name="position" value={formData.position} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">{t('profile.department')}</label>
                            <input className="form-input" name="department" value={formData.department} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">{t('profile.email')}</label>
                            <input className="form-input" type="email" name="email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">{t('profile.phone')}</label>
                            <input className="form-input" name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <a href={`/${session?.user?.teacherId ? '' : '#'}`} target="_blank" className="btn btn-secondary">
                        👁️ ดูหน้าโปรไฟล์สาธารณะ
                    </a>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                        {saving ? <><span className="spinner"></span> {t('common.loading')}</> : `💾 ${t('common.save')}`}
                    </button>
                </div>
            </form>

            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.type === 'success' ? '✅' : '❌'} {toast.message}
                </div>
            )}
        </div>
    );
}
