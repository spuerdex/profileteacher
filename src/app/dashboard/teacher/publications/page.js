'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useI18n } from '@/lib/i18n';
import styles from '../research/crud.module.css';

const BibtexModal = dynamic(() => import('./BibtexModal'), {
    loading: () => <p>Loading...</p>,
    ssr: false
});

const PublicationModal = dynamic(() => import('@/components/modals/PublicationModal'), {
    loading: () => <p>Loading...</p>,
    ssr: false
});

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
                <div className="flex flex-col sm-flex-row items-start sm-items-center justify-between gap-md">
                    <div>
                        <h1 className="page-title">📄 {t('publications.title')}</h1>
                        <p className="page-subtitle">{t('publications.subtitle')}</p>
                    </div>
                    <div className="flex flex-col sm-flex-row gap-sm xs-w-full sm-w-auto">
                        <form onSubmit={handleSearch} className="flex xs-gap-xs gap-sm xs-w-full sm-w-auto">
                            <input
                                type="text"
                                className="form-input form-input-sm"
                                style={{ flex: 1, minWidth: '0' }}
                                placeholder={t('common.search')}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button type="submit" className="btn btn-secondary btn-sm">🔍</button>
                        </form>
                        <div className="flex gap-sm xs-w-full sm-w-auto">
                            <button className="btn btn-secondary flex-1 sm-w-auto" onClick={() => setShowBibtexModal(true)}>📥 Import BibTeX</button>
                            <button className="btn btn-primary flex-1 sm-w-auto" onClick={handleOpenAdd}>➕ {t('publications.add')}</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>{t('publications.pubTitle')}</th>
                            <th>{t('publications.journal')} / {t('publications.year')}</th>
                            <th>DOI</th>
                            <th>{t('publications.link')}</th>
                            <th>{t('common.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length > 0 ? (
                            items.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="font-medium text-primary">{item.titleTh}</div>
                                        {item.titleEn && <div className="text-sm text-muted">{item.titleEn}</div>}
                                    </td>
                                    <td>
                                        <div>{item.journal || '-'}</div>
                                        {item.year && <div className="text-sm text-muted">{item.year}</div>}
                                    </td>
                                    <td>
                                        {item.doi ? (
                                            <span className="badge badge-sm badge-outline">{item.doi}</span>
                                        ) : '-'}
                                    </td>
                                    <td>
                                        {item.link ? (
                                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm text-primary">
                                                🔗 {t('common.viewAll')}
                                            </a>
                                        ) : '-'}
                                    </td>
                                    <td>
                                        <div className="flex gap-sm">
                                            <button className="btn btn-ghost btn-sm" onClick={() => handleOpenEdit(item)}>✏️</button>
                                            <button className="btn btn-ghost btn-sm text-error" onClick={() => handleDelete(item.id)}>🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className={styles.empty}>
                                    <p>📄</p>
                                    <p>ยังไม่มีผลงานตีพิมพ์</p>
                                    <div className="flex gap-2 justify-center mt-4">
                                        <button className="btn btn-secondary btn-sm" onClick={() => setShowBibtexModal(true)}>Import BibTeX</button>
                                        <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>เพิ่มผลงาน</button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {meta.totalPages > 1 && (
                <div className={styles.pagination}>
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

            <PublicationModal
                showModal={showModal}
                setShowModal={setShowModal}
                editing={editing}
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
            />

            <BibtexModal
                isOpen={showBibtexModal}
                onClose={() => setShowBibtexModal(false)}
                onImport={handleImport}
            />

            {toast && <div className={`toast toast-${toast.type}`}>{toast.type === 'success' ? '✅' : '❌'} {toast.message}</div>}
        </div>
    );
}
