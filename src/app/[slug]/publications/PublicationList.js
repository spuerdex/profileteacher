'use client';

import { useState } from 'react';
import styles from '../profile.module.css';

export default function PublicationList({ initialPublications, teacherId }) {
    const [publications, setPublications] = useState(initialPublications || []);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState((initialPublications?.length || 0) >= 5);
    const [search, setSearch] = useState('');

    const fetchPublications = async (reset = false) => {
        setLoading(true);
        const nextPage = reset ? 1 : page + 1;
        const currentSearch = search;

        try {
            const res = await fetch(
                `/api/publications?teacherId=${teacherId}&page=${nextPage}&limit=5&search=${encodeURIComponent(currentSearch)}`
            );
            const data = await res.json();

            if (data.data) {
                if (reset) {
                    setPublications(data.data);
                    setPage(1);
                    setHasMore(data.data.length >= 5);
                } else {
                    setPublications((prev) => [...prev, ...data.data]);
                    setPage(nextPage);
                    setHasMore(data.data.length >= 5);
                }
            }
        } catch (error) {
            console.error('Error fetching publications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchPublications(true);
    };

    return (
        <div>
            {/* Search Bar */}
            <form onSubmit={handleSearch} className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="ค้นหาผลงานตีพิมพ์..."
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

            <div className={styles.itemList}>
                {publications.length > 0 ? (
                    publications.map((pub) => (
                        <div key={pub.id} className={styles.itemCard}>
                            <h4>{pub.titleTh}</h4>
                            {pub.titleEn && <p className={styles.itemSubtitle}>{pub.titleEn}</p>}
                            <div className={styles.itemMeta}>
                                {pub.journal && <span className="badge">{pub.journal}</span>}
                                {pub.year && <span className="badge badge-primary">{pub.year}</span>}
                                {pub.doi && <span className="badge">DOI: {pub.doi}</span>}
                            </div>
                            {pub.link && (
                                <a href={pub.link} target="_blank" rel="noopener noreferrer" className={styles.itemLink}>
                                    🔗 ดูเพิ่มเติม
                                </a>
                            )}
                        </div>
                    ))
                ) : (
                    <div className={styles.emptySection}>
                        <p>ไม่พบข้อมูลผลงานตีพิมพ์</p>
                    </div>
                )}
            </div>

            {/* Load More */}
            {hasMore && (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button
                        onClick={() => fetchPublications(false)}
                        disabled={loading}
                        className={styles.searchBtn}
                        style={{ margin: '0 auto', opacity: loading ? 0.7 : 1, width: 'auto' }}
                    >
                        {loading ? 'กำลังโหลด...' : 'โหลดเพิ่มเติม'}
                    </button>
                </div>
            )}
        </div>
    );
}
