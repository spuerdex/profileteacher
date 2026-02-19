'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useI18n } from '@/lib/i18n';
import styles from './crud.module.css';

const ResearchModal = dynamic(() => import('@/components/modals/ResearchModal'), {
    loading: () => <p>Loading modal...</p>,
    ssr: false
});

export default function TeacherResearchPage() {
    const { data: session } = useSession();
    const { t } = useI18n();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 5;

    // Restore missing states
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({
        titleTh: '', titleEn: '', abstractTh: '', abstractEn: '',
        year: '', type: '', link: '',
    });

    const [search, setSearch] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchItems = useCallback(async () => {
        if (!session?.user?.teacherId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/research?teacherId=${session.user.teacherId}&page=${page}&limit=${LIMIT}&search=${searchTerm}`);
            const data = await res.json();
            setItems(data.data || []);
            setTotalPages(data.meta?.totalPages || 1);
        } catch { } finally { setLoading(false); }
    }, [session, page, searchTerm]);

    useEffect(() => { fetchItems(); }, [fetchItems]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setSearchTerm(search);
    };

    const showToast = (type, msg) => { setToast({ type, message: msg }); setTimeout(() => setToast(null), 3000); };
    const resetForm = () => { setFormData({ titleTh: '', titleEn: '', abstractTh: '', abstractEn: '', year: '', type: '', link: '' }); setEditing(null); };

    const handleOpenAdd = () => {
        resetForm();
        setShowEnglish(false);
        setShowModal(true);
    };

    const handleOpenEdit = (item) => {
        setFormData({
            titleTh: item.titleTh || '',
            titleEn: item.titleEn || '',
            abstractTh: item.abstractTh || '',
            abstractEn: item.abstractEn || '',
            year: item.year || '',
            type: item.type || '',
            link: item.link || ''
        });
        setEditing(item);
        if (item.titleEn || item.abstractEn) {
            setShowEnglish(true);
        } else {
            setShowEnglish(false);
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editing ? `/api/research/${editing.id}` : '/api/research';
            const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
            if (res.ok) { showToast('success', editing ? 'อัปเดตสำเร็จ!' : 'เพิ่มสำเร็จ!'); setShowModal(false); resetForm(); fetchItems(); }
            else showToast('error', 'เกิดข้อผิดพลาด');
        } catch { showToast('error', 'เกิดข้อผิดพลาด'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('ยืนยันการลบ?')) return;
        try { const res = await fetch(`/api/research/${id}`, { method: 'DELETE' }); if (res.ok) { showToast('success', 'ลบสำเร็จ!'); fetchItems(); } } catch { }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    if (loading && items.length === 0) return <div className="loading-center"><div className="spinner spinner-lg"></div></div>;

    return (
        <div>
            <div className="page-header">
                <div className="flex flex-col sm-flex-row items-start sm-items-center justify-between gap-md">
                    <div>
                        <h1 className="page-title">🔬 {t('research.title')}</h1>
                        <p className="page-subtitle">{t('research.subtitle')}</p>
                    </div>
                    <div className="flex flex-col sm-flex-row gap-sm xs-w-full sm-w-auto">
                        <form onSubmit={handleSearch} className="flex xs-gap-xs gap-sm xs-w-full sm-w-auto">
                            <input
                                type="text"
                                placeholder={t('common.search') + "..."}
                                className="form-input"
                                style={{ flex: 1, minWidth: '0' }}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button type="submit" className="btn btn-secondary">🔍</button>
                        </form>
                        <button className="btn btn-primary xs-w-full sm-w-auto" onClick={handleOpenAdd}>➕ {t('research.add')}</button>
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>{t('research.titleLabel')}</th>
                            <th>{t('research.year')}</th>
                            <th>{t('research.type')}</th>
                            <th>{t('common.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length > 0 ? (
                            items.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="font-medium">{item.titleTh}</div>
                                        {item.titleEn && <div className="text-sm text-muted">{item.titleEn}</div>}
                                    </td>
                                    <td>{item.year || '-'}</td>
                                    <td>
                                        {item.type && (
                                            <span className="badge badge-sm">
                                                {item.type === 'journal' ? 'บทความวิจัย' :
                                                    item.type === 'conference' ? 'บทความวิชาการ' :
                                                        item.type === 'book' ? 'หนังสือ' : item.type}
                                            </span>
                                        )}
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
                                <td colSpan="4" className="text-center py-xl text-muted">
                                    <div className="mb-sm" style={{ fontSize: '2rem' }}>🔬</div>
                                    <p>ยังไม่มีงานวิจัย</p>
                                    <button className="btn btn-primary btn-sm mt-md" onClick={handleOpenAdd}>เพิ่มงานวิจัย</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        className="btn btn-secondary btn-sm"
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                    >
                        ← ก่อนหน้า
                    </button>
                    <span className="flex items-center px-md text-sm text-secondary">
                        หน้าที่ {page} จาก {totalPages}
                    </span>
                    <button
                        className="btn btn-secondary btn-sm"
                        disabled={page === totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    >
                        ถัดไป →
                    </button>
                </div>
            )}

            <ResearchModal
                showModal={showModal}
                setShowModal={setShowModal}
                editing={editing}
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
            />

            {toast && <div className={`toast toast-${toast.type}`}>{toast.type === 'success' ? '✅' : '❌'} {toast.message}</div>}
        </div>
    );
}
