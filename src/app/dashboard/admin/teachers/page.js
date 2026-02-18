'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import styles from './teachers.module.css';

export default function AdminTeachersPage() {
    const { t } = useI18n();
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [resetPasswordTeacher, setResetPasswordTeacher] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({
        titleTh: '',
        firstNameTh: '',
        lastNameTh: '',
        titleEn: '',
        firstNameEn: '',
        lastNameEn: '',
        position: '',
        department: '',
        email: '',
        phone: '',
        username: '',
        password: '',
    });

    const fetchTeachers = async () => {
        try {
            const res = await fetch('/api/teachers');
            const data = await res.json();
            setTeachers(data);
        } catch {
            showToast('error', 'ไม่สามารถโหลดข้อมูลได้');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const resetForm = () => {
        setFormData({
            titleTh: '', firstNameTh: '', lastNameTh: '',
            titleEn: '', firstNameEn: '', lastNameEn: '',
            position: '', department: '', email: '', phone: '',
            username: '', password: '',
        });
        setEditingTeacher(null);
    };

    const handleOpenAdd = () => {
        resetForm();
        setShowModal(true);
    };

    const handleOpenEdit = (teacher) => {
        setFormData({
            titleTh: teacher.titleTh || '',
            firstNameTh: teacher.firstNameTh || '',
            lastNameTh: teacher.lastNameTh || '',
            titleEn: teacher.titleEn || '',
            firstNameEn: teacher.firstNameEn || '',
            lastNameEn: teacher.lastNameEn || '',
            position: teacher.position || '',
            department: teacher.department || '',
            email: teacher.email || '',
            phone: teacher.phone || '',
        });
        setEditingTeacher(teacher);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingTeacher
                ? `/api/teachers/${editingTeacher.id}`
                : '/api/teachers';
            const method = editingTeacher ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                showToast('success', editingTeacher ? 'อัปเดตสำเร็จ!' : 'เพิ่มอาจารย์สำเร็จ!');
                setShowModal(false);
                resetForm();
                fetchTeachers();
            } else {
                showToast('error', 'เกิดข้อผิดพลาด');
            }
        } catch {
            showToast('error', 'เกิดข้อผิดพลาด');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('ยืนยันการลบอาจารย์?')) return;
        try {
            const res = await fetch(`/api/teachers/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('success', 'ลบสำเร็จ!');
                fetchTeachers();
            }
        } catch {
            showToast('error', 'ไม่สามารถลบได้');
        }
    };

    const handleOpenResetPassword = (teacher) => {
        setResetPasswordTeacher(teacher);
        setNewPassword('');
        setShowPasswordModal(true);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/users/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    teacherId: resetPasswordTeacher.id,
                    newPassword: newPassword,
                }),
            });
            const result = await res.json();
            if (res.ok) {
                showToast('success', 'รีเซ็ตรหัสผ่านสำเร็จ!');
                setShowPasswordModal(false);
                setResetPasswordTeacher(null);
            } else {
                showToast('error', result.error || 'เกิดข้อผิดพลาด');
            }
        } catch {
            showToast('error', 'เกิดข้อผิดพลาด');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (loading) {
        return <div className="loading-center"><div className="spinner spinner-lg"></div></div>;
    }

    return (
        <div>
            <div className="page-header">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="page-title">{t('nav.teachers')}</h1>
                        <p className="page-subtitle">จัดการข้อมูลอาจารย์ทั้งหมดในระบบ</p>
                    </div>
                    <button className="btn btn-primary" onClick={handleOpenAdd}>
                        ➕ เพิ่มอาจารย์
                    </button>
                </div>
            </div>

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>ชื่อ-สกุล (ไทย)</th>
                            <th>ชื่อ-สกุล (EN)</th>
                            <th>ตำแหน่ง</th>
                            <th>สาขา</th>
                            <th>ธีม</th>
                            <th>{t('common.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map((teacher, idx) => (
                            <tr key={teacher.id}>
                                <td>{idx + 1}</td>
                                <td>
                                    <div className="flex items-center gap-sm">
                                        <div className={styles.miniAvatar}>
                                            {teacher.firstNameTh[0]}
                                        </div>
                                        <div>
                                            <div className="font-medium">
                                                {teacher.titleTh || ''} {teacher.firstNameTh} {teacher.lastNameTh}
                                            </div>
                                            <div className="text-xs text-muted">{teacher.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-secondary">
                                    {teacher.firstNameEn ? `${teacher.titleEn || ''} ${teacher.firstNameEn} ${teacher.lastNameEn || ''}` : '-'}
                                </td>
                                <td>{teacher.position || '-'}</td>
                                <td>{teacher.department || '-'}</td>
                                <td>
                                    {teacher.themePreset ? (
                                        <span className="flex items-center gap-sm">
                                            <span
                                                className={styles.themeDot}
                                                style={{ background: teacher.themePreset.primary }}
                                            ></span>
                                            <span className="text-sm">{teacher.themePreset.name}</span>
                                        </span>
                                    ) : '-'}
                                </td>
                                <td>
                                    <div className="flex gap-sm">
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => handleOpenEdit(teacher)}
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => handleDelete(teacher.id)}
                                            title="ลบอาจารย์"
                                        >
                                            🗑️
                                        </button>
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => handleOpenResetPassword(teacher)}
                                            title="รีเซ็ตรหัสผ่าน"
                                        >
                                            🔑
                                        </button>
                                        <a
                                            href={`/${teacher.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-ghost btn-sm"
                                        >
                                            👁️
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {teachers.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center text-muted" style={{ padding: '40px' }}>
                                    ยังไม่มีข้อมูลอาจารย์
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
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
            )}

            {/* Reset Password Modal */}
            {showPasswordModal && (
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
            )}

            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.type === 'success' ? '✅' : '❌'} {toast.message}
                </div>
            )}
        </div>
    );
}
