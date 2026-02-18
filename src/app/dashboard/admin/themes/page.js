'use client';

import { useState, useEffect } from 'react';
import styles from './themes.module.css';

export default function AdminThemesPage() {
    const [themes, setThemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        name: '', primary: '#3b82f6', primaryLight: '#60a5fa',
        primaryDark: '#2563eb', accent: '#06b6d4', gradient: '',
    });
    const [saving, setSaving] = useState(false);

    const fetchThemes = async () => {
        const res = await fetch('/api/themes');
        const data = await res.json();
        setThemes(data);
        setLoading(false);
    };

    useEffect(() => { fetchThemes(); }, []);

    const resetForm = () => {
        setForm({ name: '', primary: '#3b82f6', primaryLight: '#60a5fa', primaryDark: '#2563eb', accent: '#06b6d4', gradient: '' });
        setEditing(null);
        setShowForm(false);
    };

    const handleEdit = (theme) => {
        setForm({
            name: theme.name, primary: theme.primary, primaryLight: theme.primaryLight,
            primaryDark: theme.primaryDark, accent: theme.accent, gradient: theme.gradient || '',
        });
        setEditing(theme.id);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const url = editing ? `/api/themes/${editing}` : '/api/themes';
            const method = editing ? 'PUT' : 'POST';
            const body = { ...form };
            if (!body.gradient) {
                body.gradient = `linear-gradient(135deg, ${body.primary}, ${body.accent})`;
            }
            await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            resetForm();
            fetchThemes();
        } catch (err) {
            alert('เกิดข้อผิดพลาด');
        }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('ลบธีมนี้หรือไม่? อาจารย์ที่ใช้ธีมนี้จะถูกรีเซ็ต')) return;
        await fetch(`/api/themes/${id}`, { method: 'DELETE' });
        fetchThemes();
    };

    if (loading) return <div className="pageLoader">กำลังโหลด...</div>;

    return (
        <div>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>🎨 จัดการธีม</h1>
                    <p className={styles.subtitle}>จัดการชุดธีมสำหรับโปรไฟล์อาจารย์</p>
                </div>
                <button className={styles.addBtn} onClick={() => { resetForm(); setShowForm(true); }}>
                    ➕ เพิ่มธีมใหม่
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h3>{editing ? '✏️ แก้ไขธีม' : '➕ สร้างธีมใหม่'}</h3>
                    <div className={styles.formGrid}>
                        <label className={styles.field}>
                            <span>ชื่อธีม</span>
                            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                        </label>
                        <label className={styles.field}>
                            <span>Primary</span>
                            <div className={styles.colorInput}>
                                <input type="color" value={form.primary} onChange={(e) => setForm({ ...form, primary: e.target.value })} />
                                <input type="text" value={form.primary} onChange={(e) => setForm({ ...form, primary: e.target.value })} />
                            </div>
                        </label>
                        <label className={styles.field}>
                            <span>Primary Light</span>
                            <div className={styles.colorInput}>
                                <input type="color" value={form.primaryLight} onChange={(e) => setForm({ ...form, primaryLight: e.target.value })} />
                                <input type="text" value={form.primaryLight} onChange={(e) => setForm({ ...form, primaryLight: e.target.value })} />
                            </div>
                        </label>
                        <label className={styles.field}>
                            <span>Primary Dark</span>
                            <div className={styles.colorInput}>
                                <input type="color" value={form.primaryDark} onChange={(e) => setForm({ ...form, primaryDark: e.target.value })} />
                                <input type="text" value={form.primaryDark} onChange={(e) => setForm({ ...form, primaryDark: e.target.value })} />
                            </div>
                        </label>
                        <label className={styles.field}>
                            <span>Accent</span>
                            <div className={styles.colorInput}>
                                <input type="color" value={form.accent} onChange={(e) => setForm({ ...form, accent: e.target.value })} />
                                <input type="text" value={form.accent} onChange={(e) => setForm({ ...form, accent: e.target.value })} />
                            </div>
                        </label>
                    </div>
                    <div className={styles.previewBar} style={{ background: form.gradient || `linear-gradient(135deg, ${form.primary}, ${form.accent})` }} />
                    <div className={styles.formActions}>
                        <button type="button" className={styles.cancelBtn} onClick={resetForm}>ยกเลิก</button>
                        <button type="submit" className={styles.saveBtn} disabled={saving}>
                            {saving ? '⏳ กำลังบันทึก...' : editing ? '💾 อัปเดต' : '✅ สร้างธีม'}
                        </button>
                    </div>
                </form>
            )}

            <div className={styles.grid}>
                {themes.map((theme) => (
                    <div key={theme.id} className={styles.card}>
                        <div className={styles.cardGradient} style={{ background: theme.gradient || `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }} />
                        <div className={styles.cardBody}>
                            <h3 className={styles.cardName}>{theme.name}</h3>
                            <div className={styles.colorDots}>
                                <span style={{ background: theme.primary }} title="Primary" />
                                <span style={{ background: theme.primaryLight }} title="Light" />
                                <span style={{ background: theme.primaryDark }} title="Dark" />
                                <span style={{ background: theme.accent }} title="Accent" />
                            </div>
                            <div className={styles.cardActions}>
                                <button onClick={() => handleEdit(theme)} className={styles.editBtn}>✏️ แก้ไข</button>
                                <button onClick={() => handleDelete(theme.id)} className={styles.deleteBtn}>🗑️ ลบ</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
