'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useI18n } from '@/lib/i18n';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import styles from './Sidebar.module.css';

const teacherMenuItems = [
    { path: '/dashboard/teacher', icon: '📊', labelKey: 'nav.dashboard', exact: true },
    { path: '/dashboard/teacher/profile', icon: '👤', labelKey: 'nav.profile' },
    { path: '/dashboard/teacher/research', icon: '🔬', labelKey: 'nav.research' },
    { path: '/dashboard/teacher/activities', icon: '📋', labelKey: 'nav.activities' },
    { path: '/dashboard/teacher/publications', icon: '📄', labelKey: 'nav.publications' },
    { path: '/dashboard/teacher/courses', icon: '📚', labelKey: 'nav.courses' },
    { path: '/dashboard/teacher/articles', icon: '📰', labelKey: 'nav.articles' },
    { path: '/dashboard/teacher/education', icon: '🎓', labelKey: 'nav.education' },
    { path: '/dashboard/teacher/files', icon: '📁', labelKey: 'nav.files' },
    { path: '/dashboard/teacher/settings', icon: '⚙️', labelKey: 'nav.settings' },
];

const adminMenuItems = [
    { path: '/dashboard/admin', icon: '📊', labelKey: 'nav.dashboard', exact: true },
    { path: '/dashboard/admin/teachers', icon: '👨‍🏫', labelKey: 'nav.teachers' },
    { path: '/dashboard/admin/themes', icon: '🎨', labelKey: 'nav.themes' },
    { path: '/dashboard/admin/logs', icon: '📋', labelKey: 'nav.logs' },
    { path: '/dashboard/admin/settings', icon: '⚙️', labelKey: 'nav.systemSettings' },
];

export default function Sidebar({ role, isOpen, onClose }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const { t, locale, setLocale } = useI18n();

    const menuItems = role === 'admin' ? adminMenuItems : teacherMenuItems;

    const isActive = (item) => {
        if (item.exact) {
            return pathname === item.path;
        }
        return pathname.startsWith(item.path);
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && <div className={styles.overlay} onClick={onClose}></div>}

            <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.logo}>
                    <span className={styles.logoIcon}>👨‍🏫</span>
                    <span className={styles.logoText}>
                        {role === 'admin' ? 'Admin Panel' : 'Teacher Panel'}
                    </span>
                    <button className={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                <nav className={styles.nav}>
                    <ul className={styles.menu}>
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    href={item.path}
                                    className={`${styles.menuItem} ${isActive(item) ? styles.active : ''}`}
                                    onClick={onClose}
                                >
                                    <span className={styles.menuIcon}>{item.icon}</span>
                                    <span className={styles.menuLabel}>{t(item.labelKey)}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className={styles.footer}>
                    <div className={styles.actions}>
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>

                    <div className={styles.user}>
                        <div className={styles.userName}>
                            {session?.user?.name || session?.user?.email}
                        </div>
                        <div className={styles.userRole}>{role}</div>
                    </div>

                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className={styles.logoutBtn}
                    >
                        🚪 {t('common.logout')}
                    </button>
                </div>
            </aside>
        </>
    );
}
