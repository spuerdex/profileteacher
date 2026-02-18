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
        education: 0,
        articles: 0,
        files: 0,
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

    const statCards = [
        { icon: '🔬', value: stats.research, label: t('nav.research') },
        { icon: '📋', value: stats.activities, label: t('nav.activities') },
        { icon: '📄', value: stats.publications, label: t('nav.publications') },
        { icon: '📚', value: stats.courses, label: t('nav.courses') },
        { icon: '🎓', value: stats.education, label: t('nav.education') },
        { icon: '📝', value: stats.articles, label: t('nav.articles') },
        { icon: '📁', value: stats.files, label: t('nav.files') },
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">
                    {t('auth.welcomeBack')}, {session?.user?.name || ''}
                </h1>
                <p className="page-subtitle">{t('nav.dashboard')}</p>
            </div>

            <div className="grid grid-4">
                {statCards.map((card, i) => (
                    <div className="stat-card" key={i}>
                        <div className="stat-icon">{card.icon}</div>
                        <div>
                            <div className="stat-value">{card.value}</div>
                            <div className="stat-label">{card.label}</div>
                        </div>
                    </div>
                ))}
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

