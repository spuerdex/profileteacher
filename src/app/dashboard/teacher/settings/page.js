'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useI18n } from '@/lib/i18n';
import styles from './settings.module.css';

export default function TeacherSettings() {
    const { data: session } = useSession();
    const { t } = useI18n();
    const [themes, setThemes] = useState([]);
    const [currentThemeId, setCurrentThemeId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        // Fetch themes
        fetch('/api/themes')
            .then((res) => res.json())
            .then((data) => setThemes(data))
            .catch(() => { });

        // Fetch current teacher theme
        if (session?.user?.teacherId) {
            fetch(`/api/teachers/${session.user.teacherId}`)
                .then((res) => res.json())
                .then((data) => setCurrentThemeId(data.themePresetId))
                .catch(() => { });
        }
    }, [session]);

    const handleSelectTheme = async (themeId) => {
        if (!session?.user?.teacherId) return;
        setSaving(true);

        try {
            const res = await fetch(`/api/teachers/${session.user.teacherId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ themePresetId: themeId }),
            });

            if (res.ok) {
                setCurrentThemeId(themeId);
                setToast({ type: 'success', message: 'บันทึกธีมสำเร็จ!' });
            } else {
                setToast({ type: 'error', message: 'ไม่สามารถบันทึกได้' });
            }
        } catch {
            setToast({ type: 'error', message: 'เกิดข้อผิดพลาด' });
        } finally {
            setSaving(false);
            setTimeout(() => setToast(null), 3000);
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">{t('theme.title')}</h1>
                <p className="page-subtitle">{t('theme.subtitle')}</p>
            </div>

            <div className={styles.themeGrid}>
                {themes.map((theme) => (
                    <div
                        key={theme.id}
                        className={`${styles.themeCard} ${currentThemeId === theme.id ? styles.selected : ''}`}
                        onClick={() => handleSelectTheme(theme.id)}
                    >
                        <div
                            className={styles.themePreview}
                            style={{ background: theme.gradient || theme.primary }}
                        >
                            <div className={styles.previewContent}>
                                <div
                                    className={styles.previewHeader}
                                    style={{ background: theme.primaryDark }}
                                ></div>
                                <div className={styles.previewBody}>
                                    <div
                                        className={styles.previewDot}
                                        style={{ background: theme.primary }}
                                    ></div>
                                    <div
                                        className={styles.previewLine}
                                        style={{ background: theme.primaryLight }}
                                    ></div>
                                    <div
                                        className={styles.previewLine2}
                                        style={{ background: theme.accent }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.themeInfo}>
                            <div className={styles.themeName}>{theme.name}</div>
                            <div className={styles.themeColors}>
                                <span
                                    className={styles.colorDot}
                                    style={{ background: theme.primary }}
                                ></span>
                                <span
                                    className={styles.colorDot}
                                    style={{ background: theme.primaryLight }}
                                ></span>
                                <span
                                    className={styles.colorDot}
                                    style={{ background: theme.accent }}
                                ></span>
                            </div>
                        </div>

                        {currentThemeId === theme.id && (
                            <div className={styles.selectedBadge}>✓ {t('theme.current')}</div>
                        )}
                    </div>
                ))}
            </div>

            {saving && (
                <div className="loading-center">
                    <div className="spinner"></div>
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
