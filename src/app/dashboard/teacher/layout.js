'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import styles from './dashboard.module.css';

export default function TeacherDashboardLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className={styles.dashboardLayout}>
            {/* Mobile Header */}
            <header className={styles.mobileHeader}>
                <button
                    className={styles.menuBtn}
                    onClick={() => setIsSidebarOpen(true)}
                >
                    ☰
                </button>
                <span className={styles.mobileTitle}>Teacher Panel</span>
            </header>

            <Sidebar
                role="teacher"
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            <div className={styles.mainWrapper}>
                <main className={styles.mainContent}>
                    {children}
                </main>
                <footer className={styles.dashboardFooter}>
                    <p>© {new Date().getFullYear()} Digital of Technology, Chiang Rai Rajabhat University</p>
                    <p>Powered by: Chinnarat K. | Computer Technical Officer</p>
                </footer>
            </div>
        </div>
    );
}
