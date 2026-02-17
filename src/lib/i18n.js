'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import thMessages from '@/messages/th.json';
import enMessages from '@/messages/en.json';

const messages = { th: thMessages, en: enMessages };

const I18nContext = createContext();

export function I18nProvider({ children }) {
    const [locale, setLocale] = useState('th');

    useEffect(() => {
        const saved = localStorage.getItem('locale');
        if (saved && messages[saved]) {
            setLocale(saved);
        }
    }, []);

    const changeLocale = (newLocale) => {
        setLocale(newLocale);
        localStorage.setItem('locale', newLocale);
    };

    const t = (path) => {
        const keys = path.split('.');
        let result = messages[locale];
        for (const key of keys) {
            if (result && result[key] !== undefined) {
                result = result[key];
            } else {
                return path; // Fallback to path string
            }
        }
        return result;
    };

    return (
        <I18nContext.Provider value={{ locale, setLocale: changeLocale, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within I18nProvider');
    }
    return context;
}
