'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useI18n } from '@/lib/i18n';
import styles from './teachers.module.css';

const TeacherManagementModal = dynamic(() => import('@/components/modals/TeacherManagementModal'), {
    loading: () => <p>Loading...</p>,
    ssr: false
});

const PasswordResetModal = dynamic(() => import('@/components/modals/PasswordResetModal'), {
    loading: () => <p>Loading...</p>,
    ssr: false
});

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
                <div className="flex flex-col sm-flex-row items-start sm-items-center justify-between gap-md">
                    <div>
                        <h1 className="page-title">{t('nav.teachers')}</h1>
                        <p className="page-subtitle">จัดการข้อมูลอาจารย์ทั้งหมดในระบบ</p>
                    </div>
                    <button className="btn btn-primary xs-w-full sm-w-auto" onClick={handleOpenAdd}>
                        ➕ เพิ่มอาจารย์
                    </button>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>ชื่อ-สกุล (ไทย)</th>
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

            <TeacherManagementModal
                showModal={showModal}
                setShowModal={setShowModal}
                editingTeacher={editingTeacher}
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
            />

            <PasswordResetModal
                showPasswordModal={showPasswordModal}
                setShowPasswordModal={setShowPasswordModal}
                resetPasswordTeacher={resetPasswordTeacher}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                handleResetPassword={handleResetPassword}
            />

            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.type === 'success' ? '✅' : '❌'} {toast.message}
                </div>
            )}
        </div>
    );
}
