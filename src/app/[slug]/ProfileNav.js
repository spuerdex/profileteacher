'use client';

import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import styles from './nav.module.css';

export default function ProfileNav({ teacher, navItems, slug }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const fullNameTh = `${teacher.titleTh || ''} ${teacher.firstNameTh} ${teacher.lastNameTh}`.trim();

    return (
        <nav className={styles.nav}>
            <div className={styles.navInner}>
                <Link href={`/${slug}`} className={styles.brand} onClick={closeMenu}>
                    <div className={styles.brandAvatar}>
                        {teacher.avatar ? (
                            <img src={teacher.avatar} alt={fullNameTh} />
                        ) : (
                            <span>{teacher.firstNameTh[0]}</span>
                        )}
                    </div>
                    <span className={styles.brandName}>{fullNameTh}</span>
                </Link>

                {/* Desktop Links */}
                <div className={styles.navLinks}>
                    {navItems.map((item) => (
                        <Link
                            key={item.key}
                            href={`/${slug}${item.href}`}
                            className={styles.navLink}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className={styles.navActions}>
                    <LanguageToggle />
                    <ThemeToggle />
                </div>

                {/* Mobile Toggle Button */}
                <button
                    className={`${styles.navToggle} ${isMenuOpen ? styles.active : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle navigation"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* Mobile Menu */}
                <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.show : ''}`}>
                    {navItems.map((item) => (
                        <Link
                            key={item.key}
                            href={`/${slug}${item.href}`}
                            className={styles.mobileLink}
                            onClick={closeMenu}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
