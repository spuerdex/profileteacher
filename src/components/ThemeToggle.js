'use client';

import { useThemeMode } from '@/lib/themeMode';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
    const { mode, toggle } = useThemeMode();

    return (
        <button
            onClick={toggle}
            className={styles.toggle}
            aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={mode === 'dark' ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'}
        >
            <span className={styles.icon}>
                {mode === 'dark' ? '☀️' : '🌙'}
            </span>
        </button>
    );
}
