'use client';

import { useState } from 'react';
import styles from '../profile.module.css';

export default function ActivityList({ initialActivities, teacherId }) {
    const [activities, setActivities] = useState(initialActivities || []);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState((initialActivities?.length || 0) >= 10);
    const [search, setSearch] = useState('');

    const [selectedActivity, setSelectedActivity] = useState(null);

    const fetchActivities = async (reset = false) => {
        setLoading(true);
        const nextPage = reset ? 1 : page + 1;
        const currentSearch = search;

        try {
            const res = await fetch(
                `/api/activities?teacherId=${teacherId}&page=${nextPage}&limit=10&search=${encodeURIComponent(currentSearch)}`
            );
            const data = await res.json();

            if (data.data) {
                if (reset) {
                    setActivities(data.data);
                    setPage(1);
                    setHasMore(data.data.length >= 10);
                } else {
                    setActivities((prev) => [...prev, ...data.data]);
                    setPage(nextPage);
                    setHasMore(data.data.length >= 10);
                }
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchActivities(true);
    };

    return (
        <div>
            {/* Search Bar */}
            <form onSubmit={handleSearch} className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="ค้นหากิจกรรม..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    type="submit"
                    className={styles.searchBtn}
                >
                    🔍 ค้นหา
                </button>
            </form>

            <div className={styles.activityGrid}>
                {activities.length > 0 ? (
                    activities.map((item) => (
                        <div
                            key={item.id}
                            className={`${styles.itemCard} ${styles.clickableCard}`}
                            onClick={() => setSelectedActivity(item)}
                        >
                            <h4>{item.titleTh}</h4>
                            {item.titleEn && <p className={styles.itemSubtitle}>{item.titleEn}</p>}
                            {item.date && (
                                <span className="badge badge-primary">
                                    {new Date(item.date).toLocaleDateString('th-TH', {
                                        year: 'numeric', month: 'long', day: 'numeric',
                                    })}
                                </span>
                            )}
                            {item.descriptionTh && <p className={styles.itemDesc}>{item.descriptionTh}</p>}
                            {item.descriptionEn && <p className={`${styles.itemDesc} ${styles.bioEn}`}>{item.descriptionEn}</p>}
                        </div>
                    ))
                ) : (
                    <div className={styles.emptySection}>
                        <p>ไม่พบข้อมูลกิจกรรม</p>
                    </div>
                )}
            </div>

            {/* Load More */}
            {hasMore && (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button
                        onClick={() => fetchActivities(false)}
                        disabled={loading}
                        className={styles.searchBtn}
                        style={{ margin: '0 auto', opacity: loading ? 0.7 : 1, width: 'auto' }}
                    >
                        {loading ? 'กำลังโหลด...' : 'โหลดเพิ่มเติม'}
                    </button>
                </div>
            )}

            {/* Detail Modal */}
            <ActivityDetailModal
                isOpen={!!selectedActivity}
                onClose={() => setSelectedActivity(null)}
                activity={selectedActivity}
            />
        </div>
    );
}

import ActivityDetailModal from './ActivityDetailModal';
