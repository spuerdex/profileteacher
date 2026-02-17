'use client';

import { useSession } from 'next-auth/react';
import { useI18n } from '@/lib/i18n';
import { useState, useEffect } from 'react';

export default function TeacherDashboard() {
    const { data: session } = useSession();
    const { t } = useI18n();
    const [stats, setStats] = useState({
        research: 0,
        activities: 0,
        publications: 0,
        courses: 0,
        pageViews: 0,
    });

    useEffect(() => {
        if (session?.user?.teacherId) {
            fetch(`/api/teachers/${session.user.teacherId}/stats`)
                .then((res) => res.json())
                .then((data) => setStats(data))
                .catch(() => { });
        }
    }, [session]);

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">
                    {t('auth.welcomeBack')}, {session?.user?.name || ''}
                </h1>
                <p className="page-subtitle">{t('nav.dashboard')}</p>
            </div>

            <div className="grid grid-4">
                <div className="stat-card">
                    <div className="stat-icon">🔬</div>
                    <div>
                        <div className="stat-value">{stats.research}</div>
                        <div className="stat-label">{t('nav.research')}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <div>
                        <div className="stat-value">{stats.activities}</div>
                        <div className="stat-label">{t('nav.activities')}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📄</div>
                    <div>
                        <div className="stat-value">{stats.publications}</div>
                        <div className="stat-label">{t('nav.publications')}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📚</div>
                    <div>
                        <div className="stat-value">{stats.courses}</div>
                        <div className="stat-label">{t('nav.courses')}</div>
                    </div>
                </div>
            </div>

            <div className="mt-lg">
                <div className="stat-card" style={{ maxWidth: 300 }}>
                    <div className="stat-icon">👁️</div>
                    <div>
                        <div className="stat-value">{stats.pageViews}</div>
                        <div className="stat-label">Profile Views</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
