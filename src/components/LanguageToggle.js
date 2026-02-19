'use client';

import { useI18n } from '@/lib/i18n';
import styles from './ThemeToggle.module.css';

export default function LanguageToggle() {
    const { locale, setLocale } = useI18n();

    const toggleLanguage = () => {
        setLocale(locale === 'th' ? 'en' : 'th');
    };

    return (
        <button
            onClick={toggleLanguage}
            className={styles.toggle}
            aria-label="Switch Language"
            title={locale === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
        >
            <span className={styles.icon} style={{ fontSize: '1rem' }}>
                {locale === 'th' ? '🇹🇭' : '🇺🇸'}
            </span>
        </button>
    );
}
