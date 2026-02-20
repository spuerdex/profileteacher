'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './CookieConsent.module.css';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            // Delay showing the banner for a smoother effect after page load
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.banner}>
                <div className={styles.content}>
                    <h3 className={styles.title}>
                        🍪 นโยบายการใช้งานคุ๊กกี้ (Cookie Policy)
                    </h3>
                    <p className={styles.description}>
                        เรามีการใช้คุกกี้เพื่อเพิ่มประสิทธิภาพและประสบการณ์ที่ดีในการใช้งานเว็บไซต์
                        คุณสามารถอ่านรายละเอียดเพิ่มเติมได้ที่{' '}
                        <Link href="/cookie-policy" className={styles.policyLink}>
                            นโยบายคุกกี้
                        </Link>
                    </p>
                </div>
                <div className={styles.actions}>
                    <button onClick={handleDecline} className={styles.declineBtn}>
                        ปฏิเสธ
                    </button>
                    <button onClick={handleAccept} className={styles.acceptBtn}>
                        ยอมรับทั้งหมด
                    </button>
                </div>
            </div>
        </div>
    );
}
