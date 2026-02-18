'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeModeContext = createContext({ mode: 'dark', toggle: () => { } });

export function ThemeModeProvider({ children }) {
    const [mode, setMode] = useState('dark');

    useEffect(() => {
        const saved = localStorage.getItem('theme-mode');
        if (saved === 'light' || saved === 'dark') {
            setMode(saved);
            document.documentElement.setAttribute('data-theme', saved);
        }
    }, []);

    const toggle = () => {
        const next = mode === 'dark' ? 'light' : 'dark';
        setMode(next);
        localStorage.setItem('theme-mode', next);
        document.documentElement.setAttribute('data-theme', next);
    };

    return (
        <ThemeModeContext.Provider value={{ mode, toggle }}>
            {children}
        </ThemeModeContext.Provider>
    );
}

export function useThemeMode() {
    return useContext(ThemeModeContext);
}
