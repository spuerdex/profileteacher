'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import styles from '../profile.module.css';

export default function ActivityDetailModal({ isOpen, onClose, activity }) {
    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen || !activity) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">รายละเอียดกิจกรรม</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div className={styles.modalBody}>
                    {activity.imageUrl && (
                        <div className={styles.modalImageWrapper}>
                            <Image
                                src={activity.imageUrl}
                                alt={activity.titleTh}
                                width={800}
                                height={450}
                                className={styles.modalImage}
                                style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-md)' }}
                            />
                        </div>
                    )}

                    <h4 className={styles.modalActivityTitle}>{activity.titleTh}</h4>
                    {activity.titleEn && <p className={styles.modalActivitySubtitle}>{activity.titleEn}</p>}

                    <div className={styles.itemMeta} style={{ margin: '1rem 0' }}>
                        {activity.date && (
                            <span className="badge badge-primary">
                                📅 {new Date(activity.date).toLocaleDateString('th-TH', {
                                    year: 'numeric', month: 'long', day: 'numeric',
                                })}
                            </span>
                        )}
                        {activity.type && <span className="badge">{activity.type}</span>}
                    </div>

                    <div className={styles.modalDescription}>
                        {activity.descriptionTh && <p>{activity.descriptionTh}</p>}
                        {activity.descriptionEn && (
                            <p className={styles.bioEn} style={{ marginTop: '0.5rem' }}>{activity.descriptionEn}</p>
                        )}
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>ปิด</button>
                </div>
            </div>
        </div>
    );
}
