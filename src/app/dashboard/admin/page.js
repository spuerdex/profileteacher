'use client';

import { useI18n } from '@/lib/i18n';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
    const { t } = useI18n();
    const [stats, setStats] = useState({
        totalTeachers: 0,
        totalResearch: 0,
        totalActivities: 0,
        totalViews: 0,
    });

    useEffect(() => {
        fetch('/api/admin/stats')
            .then((res) => res.json())
            .then((data) => setStats(data))
            .catch(() => { });
    }, []);

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Admin {t('nav.dashboard')}</h1>
                <p className="page-subtitle">ภาพรวมระบบจัดการโปรไฟล์อาจารย์</p>
            </div>

            <div className="grid grid-4">
                <div className="stat-card">
                    <div className="stat-icon">👨‍🏫</div>
                    <div>
                        <div className="stat-value">{stats.totalTeachers}</div>
                        <div className="stat-label">อาจารย์ทั้งหมด</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🔬</div>
                    <div>
                        <div className="stat-value">{stats.totalResearch}</div>
                        <div className="stat-label">งานวิจัยทั้งหมด</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <div>
                        <div className="stat-value">{stats.totalActivities}</div>
                        <div className="stat-label">กิจกรรมทั้งหมด</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">👁️</div>
                    <div>
                        <div className="stat-value">{stats.totalViews}</div>
                        <div className="stat-label">ยอดเข้าชมรวม</div>
                    </div>
                </div>
            </div>

            <div className="mt-lg">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">จัดการด่วน</h3>
                    </div>
                    <div className="flex gap-md" style={{ flexWrap: 'wrap' }}>
                        <Link href="/dashboard/admin/teachers" className="btn btn-primary">
                            👨‍🏫 {t('nav.teachers')}
                        </Link>
                        <Link href="/dashboard/admin/themes" className="btn btn-secondary">
                            🎨 {t('nav.themes')}
                        </Link>
                        <Link href="/dashboard/admin/settings" className="btn btn-secondary">
                            ⚙️ {t('nav.systemSettings')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
