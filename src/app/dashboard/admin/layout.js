'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import styles from '../teacher/dashboard.module.css';

export default function AdminDashboardLayout({ children }) {
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
                <span className={styles.mobileTitle}>Admin Panel</span>
            </header>

            <Sidebar
                role="admin"
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
