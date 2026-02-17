'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import styles from './login.module.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { t } = useI18n();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError(t('auth.loginError'));
            } else {
                // Fetch session to determine redirect
                const res = await fetch('/api/auth/session');
                const session = await res.json();
                if (session?.user?.role === 'admin') {
                    router.push('/dashboard/admin');
                } else {
                    router.push('/dashboard/teacher');
                }
            }
        } catch {
            setError(t('auth.loginError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.bgPattern}>
                <div className={styles.bgGlow1}></div>
                <div className={styles.bgGlow2}></div>
            </div>

            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.logo}>👨‍🏫</div>
                    <h1 className={styles.title}>{t('auth.loginTitle')}</h1>
                    <p className={styles.subtitle}>{t('auth.loginSubtitle')}</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && (
                        <div className={styles.error}>
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">{t('auth.email')}</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">{t('auth.password')}</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={`btn btn-primary btn-lg ${styles.loginBtn}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                {t('common.loading')}
                            </>
                        ) : (
                            t('auth.loginButton')
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
