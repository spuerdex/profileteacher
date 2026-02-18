'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useI18n } from '@/lib/i18n';
import styles from '../research/crud.module.css'; // Reusing styles

export default function TeacherArticlesPage() {
    const { data: session } = useSession();
    const { t } = useI18n();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [toast, setToast] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '', content: '', coverImage: '', published: true
    });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 10;

    const fetchItems = useCallback(async () => {
        if (!session?.user?.teacherId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/articles?teacherId=${session.user.teacherId}&page=${page}&limit=${LIMIT}`);
            if (res.ok) {
                const data = await res.json();
                setItems(data.articles || []);
                setTotalPages(data.totalPages || 1);
            }
        } catch { } finally { setLoading(false); }
    }, [session, page]);

    useEffect(() => { fetchItems(); }, [fetchItems]);

    const showToast = (type, msg) => { setToast({ type, message: msg }); setTimeout(() => setToast(null), 3000); };
    const resetForm = () => { setFormData({ title: '', content: '', coverImage: '', published: true }); setEditing(null); };

    const handleOpenAdd = () => { resetForm(); setShowModal(true); };
    const handleOpenEdit = (item) => {
        setFormData({
            title: item.title || '',
            content: item.content || '',
            coverImage: item.coverImage || '',
            published: item.published,
        });
        setEditing(item); setShowModal(true);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.append('file', file);
        data.append('type', 'general'); // Or 'articles' if we created that folder

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: data });
            if (res.ok) {
                const json = await res.json();
                setFormData(prev => ({ ...prev, coverImage: json.url }));
                showToast('success', 'อัปโหลดรูปภาพสำเร็จ');
            } else {
                showToast('error', 'อัปโหลดล้มเหลว');
            }
        } catch {
            showToast('error', 'เกิดข้อผิดพลาดในการอัปโหลด');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editing ? `/api/articles/${editing.id}` : '/api/articles';
            const res = await fetch(url, {
                method: editing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                showToast('success', editing ? 'อัปเดตสำเร็จ!' : 'เพิ่มสำเร็จ!');
                setShowModal(false); resetForm(); fetchItems();
            } else {
                showToast('error', 'บันทึกไม่สำเร็จ');
            }
        } catch { showToast('error', 'เกิดข้อผิดพลาด'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('ยืนยันการลบ?')) return;
        try {
            const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
            if (res.ok) { showToast('success', 'ลบสำเร็จ!'); fetchItems(); }
        } catch { }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    if (loading && page === 1 && items.length === 0) return <div className="loading-center"><div className="spinner spinner-lg"></div></div>;

    return (
        <div>
            <div className="page-header">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="page-title">📰 {t('articles.title')}</h1>
                        <p className="page-subtitle">เขียนและจัดการบทความของคุณ</p>
                    </div>
                    <button className="btn btn-primary" onClick={handleOpenAdd}>➕ {t('articles.addNew')}</button>
                </div>
            </div>

            <div className="card-content" style={{ overflowX: 'auto' }}>
                <table className="table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                            <th style={{ padding: '12px', width: '60px' }}>#</th>
                            <th style={{ padding: '12px', width: '100px' }}>รูปปก</th>
                            <th style={{ padding: '12px' }}>หัวข้อ</th>
                            <th style={{ padding: '12px', width: '120px' }}>สถานะ</th>
                            <th style={{ padding: '12px', width: '150px' }}>วันที่</th>
                            <th style={{ padding: '12px', width: '100px', textAlign: 'center' }}>จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.95rem' }}>
                                <td style={{ padding: '12px', opacity: 0.7 }}>{(page - 1) * LIMIT + index + 1}</td>
                                <td style={{ padding: '12px' }}>
                                    {item.coverImage ? (
                                        <img src={item.coverImage} alt="Cover" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                    ) : (
                                        <div style={{ width: '60px', height: '40px', background: 'var(--bg-secondary)', borderRadius: '4px' }}></div>
                                    )}
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>{item.title}</div>
                                    <div style={{ fontSize: '0.85rem', opacity: 0.7, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                                        {item.content}
                                    </div>
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <span className={`badge ${item.published ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.8rem', padding: '4px 8px' }}>
                                        {item.published ? 'เผยแพร่แล้ว' : 'แบบร่าง'}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', fontSize: '0.9rem', opacity: 0.8 }}>
                                    {new Date(item.createdAt).toLocaleDateString('th-TH')}
                                </td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                    <div className="flex gap-xs justify-center">
                                        <button className="btn btn-ghost btn-sm" onClick={() => handleOpenEdit(item)} title="แก้ไข">✏️</button>
                                        <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(item.id)} title="ลบ">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {items.length === 0 && !loading && (
                    <div className={styles.empty} style={{ padding: '40px 0' }}>
                        <p>📰</p>
                        <p>ยังไม่มีบทความ</p>
                        <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>{t('articles.addNew')}</button>
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-md mt-lg" style={{ padding: '20px 0' }}>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                        >
                            ← ก่อนหน้า
                        </button>
                        <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                            หน้า {page} จาก {totalPages}
                        </span>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                        >
                            ถัดไป →
                        </button>
                    </div>
                )}
            </div>

            {showModal && (
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
                                />
                            </div>

                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="published"
                                        checked={formData.published}
                                        onChange={handleChange}
                                    />
                                    <span>{t('articles.published')} (แสดงบนหน้าเว็บทันที)</span>
                                </label>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>{t('common.cancel')}</button>
                                <button type="submit" className="btn btn-primary" disabled={uploading}>
                                    {t('common.save')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {toast && <div className={`toast toast-${toast.type}`}>{toast.type === 'success' ? '✅' : '❌'} {toast.message}</div>}
        </div>
    );
}
