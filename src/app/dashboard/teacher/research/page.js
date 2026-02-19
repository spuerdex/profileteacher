'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useI18n } from '@/lib/i18n';
import styles from './crud.module.css';

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

    const fetchItems = useCallback(async () => {
        if (!session?.user?.teacherId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/research?teacherId=${session.user.teacherId}&page=${page}&limit=${LIMIT}`);
            const data = await res.json();
            setItems(data.data || []);
            setTotalPages(data.meta?.totalPages || 1);
        } catch { } finally { setLoading(false); }
    }, [session, page]);

    useEffect(() => { fetchItems(); }, [fetchItems]);

    const showToast = (type, msg) => { setToast({ type, message: msg }); setTimeout(() => setToast(null), 3000); };
    const resetForm = () => { setFormData({ titleTh: '', titleEn: '', abstractTh: '', abstractEn: '', year: '', type: '', link: '' }); setEditing(null); };

    const [showEnglish, setShowEnglish] = useState(false);

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
        // Auto-show English if data exists
        if (item.titleEn || item.abstractEn) {
            setShowEnglish(true);
        } else {
            setShowEnglish(false);
        }
        setShowModal(true);
    };

    // ... existing code ...

    <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label className="form-label">{t('research.titleLabel')} (TH) *</label>
            <input className="form-input" name="titleTh" value={formData.titleTh} onChange={handleChange} required />
        </div>

        <div className="form-group">
            <div className="flex items-center gap-sm mb-sm">
                <input
                    type="checkbox"
                    id="showEnglish"
                    checked={showEnglish}
                    onChange={(e) => setShowEnglish(e.target.checked)}
                    style={{ width: 'auto', margin: 0 }}
                />
                <label htmlFor="showEnglish" style={{ cursor: 'pointer', userSelect: 'none' }}>
                    เพิ่มข้อมูลภาษาอังกฤษ (Add English Data)
                </label>
            </div>
        </div>

        {showEnglish && (
            <div className="form-group fade-in">
                <label className="form-label">{t('research.titleLabel')} (EN)</label>
                <input className="form-input" name="titleEn" value={formData.titleEn} onChange={handleChange} />
            </div>
        )}

        <div className="grid grid-2">
            <div className="form-group">
                <label className="form-label">{t('research.year')}</label>
                <input className="form-input" type="number" name="year" value={formData.year} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label className="form-label">{t('research.type')}</label>
                <select className="form-input" name="type" value={formData.type} onChange={handleChange}>
                    <option value="">เลือกประเภท</option>
                    <option value="journal">บทความวิจัย</option>
                    <option value="conference">บทความวิชาการ</option>
                    <option value="book">หนังสือ/ตำรา</option>
                    <option value="patent">สิทธิบัตร</option>
                    <option value="other">อื่นๆ</option>
                </select>
            </div>
        </div>

        <div className="form-group">
            <label className="form-label">{t('research.abstract')} (TH)</label>
            <textarea className="form-textarea" name="abstractTh" value={formData.abstractTh} onChange={handleChange} rows={3} />
        </div>

        {showEnglish && (
            <div className="form-group fade-in">
                <label className="form-label">{t('research.abstract')} (EN)</label>
                <textarea className="form-textarea" name="abstractEn" value={formData.abstractEn} onChange={handleChange} rows={3} />
            </div>
        )}
        <div className="form-group">
            <label className="form-label">🔗 {t('research.link')}</label>
            <input className="form-input" name="link" value={formData.link} onChange={handleChange} placeholder="https://..." />
        </div>
        <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>{t('common.cancel')}</button>
            <button type="submit" className="btn btn-primary">{t('common.save')}</button>
        </div>
    </form>
                    </div >
                </div >
            )
}

{ toast && <div className={`toast toast-${toast.type}`}>{toast.type === 'success' ? '✅' : '❌'} {toast.message}</div> }
        </div >
    );
}
