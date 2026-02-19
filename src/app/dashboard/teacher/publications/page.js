'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useI18n } from '@/lib/i18n';
import styles from '../research/crud.module.css';
import BibtexModal from './BibtexModal';

export default function TeacherPublicationsPage() {
    const { data: session } = useSession();
    const { t } = useI18n();
    const [items, setItems] = useState([]);
    const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showBibtexModal, setShowBibtexModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({ titleTh: '', titleEn: '', journal: '', year: '', doi: '', link: '' });
    const LIMIT = 10;

    const fetchItems = useCallback(async () => {
        if (!session?.user?.teacherId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/publications?teacherId=${session.user.teacherId}&page=${page}&limit=${LIMIT}&search=${searchTerm}`);
            const result = await res.json();
            setItems(result.data || []);
            setMeta(result.meta || { total: 0, page: 1, limit: LIMIT, totalPages: 1 });
        } catch { } finally { setLoading(false); }
    }, [session, page, searchTerm]);

    useEffect(() => { fetchItems(); }, [fetchItems]);

    const showToast = (type, msg) => { setToast({ type, message: msg }); setTimeout(() => setToast(null), 3000); };
    const resetForm = () => { setFormData({ titleTh: '', titleEn: '', journal: '', year: '', doi: '', link: '' }); setEditing(null); };
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setSearchTerm(search);
    };

    const handleOpenAdd = () => { resetForm(); setShowModal(true); };
    const handleOpenEdit = (item) => {
        setFormData({
            titleTh: item.titleTh || '',
            titleEn: item.titleEn || '',
            journal: item.journal || '',
            year: item.year || '',
            doi: item.doi || '',
            link: item.link || ''
        });
        setEditing(item); setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editing ? `/api/publications/${editing.id}` : '/api/publications';
            const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
            if (res.ok) { showToast('success', editing ? 'อัปเดตสำเร็จ!' : 'เพิ่มสำเร็จ!'); setShowModal(false); resetForm(); fetchItems(); }
            else showToast('error', 'เกิดข้อผิดพลาด');
        } catch { showToast('error', 'เกิดข้อผิดพลาด'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('ยืนยันการลบ?')) return;
        try { const res = await fetch(`/api/publications/${id}`, { method: 'DELETE' }); if (res.ok) { showToast('success', 'ลบสำเร็จ!'); fetchItems(); } } catch { }
    };

    const handleImport = async (importedItems) => {
        try {
            // Sequential or parallel requests? standard is parallel but let's do it safely
            const promises = importedItems.map(item =>
                fetch('/api/publications', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...item, teacherId: session.user.teacherId })
                })
            );

            await Promise.all(promises);
            showToast('success', `นำเข้า ${importedItems.length} รายการสำเร็จ!`); // Import success
            fetchItems();
        } catch (err) {
            console.error(err);
            showToast('error', 'เกิดข้อผิดพลาดในการนำเข้า');
        }
    };

    if (loading) return <div className="loading-center"><div className="spinner spinner-lg"></div></div>;

    return (
        <div>
            <div className="page-header">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="page-title">📄 {t('publications.title')}</h1>
                        <p className="page-subtitle">{t('publications.subtitle')}</p>
                    </div>
                    <div className="flex gap-sm">
                        <form onSubmit={handleSearch} className="flex gap-xs">
                            <input
                                type="text"
                                className="form-input form-input-sm"
                                placeholder={t('common.search')}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button type="submit" className="btn btn-secondary btn-sm">🔍</button>
                        </form>
                        <button className="btn btn-secondary" onClick={() => setShowBibtexModal(true)}>📥 Import BibTeX</button>
                        <button className="btn btn-primary" onClick={handleOpenAdd}>➕ {t('publications.add')}</button>
                    </div>
                </div>
            </div>

            <div className={styles.itemsList}>
                {items.map((item) => (
                    <div key={item.id} className={styles.itemCard}>
                        <div className={styles.itemHeader}>
                            <h3 className={styles.itemTitle}>{item.titleTh}</h3>
                            <div className="flex gap-2">
                                <button className="btn btn-ghost btn-sm" onClick={() => handleOpenEdit(item)}>✏️</button>
                                <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(item.id)}>🗑️</button>
                            </div>
                        </div>
                        {item.titleEn && <p className={styles.itemSub}>{item.titleEn}</p>}
                        <div className={styles.itemMeta}>
                            {item.journal && <span className="badge">{item.journal}</span>}
                            {item.year && <span className="badge badge-primary">{item.year}</span>}
                            {item.doi && <span className="badge badge-outline">DOI: {item.doi}</span>}
                        </div>
                        {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className={styles.itemLink}>🔗 ลิงก์</a>}
                    </div>
                ))}
                {items.length === 0 && (
                    <div className={styles.empty}>
                        <p>📄</p>
                        <p>ยังไม่มีผลงานตีพิมพ์</p>
                        <div className="flex gap-2 justify-center mt-4">
                            <button className="btn btn-secondary btn-sm" onClick={() => setShowBibtexModal(true)}>Import BibTeX</button>
                            <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>เพิ่มผลงาน</button>
                        </div>
                    </div>
                )}
            </div>

            {meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8 pb-8">
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        ← {t('common.back')}
                    </button>
                    <span className="text-sm">
                        {t('common.page')} {meta.page} {t('common.of')} {meta.totalPages}
                    </span>
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                        disabled={page === meta.totalPages}
                    >
                        {t('common.next')} →
                    </button>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">{editing ? '✏️ แก้ไขผลงาน' : '➕ เพิ่มผลงาน'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">ชื่อผลงาน (TH) *</label>
                                <input className="form-input" name="titleTh" value={formData.titleTh} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Title (EN)</label>
                                <input className="form-input" name="titleEn" value={formData.titleEn} onChange={handleChange} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">วารสาร/สิ่งพิมพ์</label>
                                    <input className="form-input" name="journal" value={formData.journal} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">ปี</label>
                                    <input className="form-input" type="number" name="year" value={formData.year} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">DOI</label>
                                <input className="form-input" name="doi" value={formData.doi} onChange={handleChange} placeholder="10.xxxx/..." />
                            </div>
                            <div className="form-group">
                                <label className="form-label">🔗 ลิงก์</label>
                                <input className="form-input" name="link" value={formData.link} onChange={handleChange} placeholder="https://..." />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>{t('common.cancel')}</button>
                                <button type="submit" className="btn btn-primary">{t('common.save')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <BibtexModal
                isOpen={showBibtexModal}
                onClose={() => setShowBibtexModal(false)}
                onImport={handleImport}
            />

            {toast && <div className={`toast toast-${toast.type}`}>{toast.type === 'success' ? '✅' : '❌'} {toast.message}</div>}
        </div>
    );
}
