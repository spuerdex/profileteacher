'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../profile.module.css';

export default function ResearchList({ initialResearch, teacherId, slug }) {
    const [research, setResearch] = useState(initialResearch);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialResearch.length >= 10);
    const [search, setSearch] = useState('');

    const fetchResearch = async (reset = false) => {
        setLoading(true);
        const nextPage = reset ? 1 : page + 1;
        const currentSearch = search; // Capture current search term

        try {
            const res = await fetch(
                `/api/research?teacherId=${teacherId}&page=${nextPage}&limit=10&search=${encodeURIComponent(currentSearch)}`
            );
            const data = await res.json();

            if (data.data) {
                if (reset) {
                    setResearch(data.data);
                    setPage(1);
                    setHasMore(data.data.length >= 10);
                } else {
                    setResearch((prev) => [...prev, ...data.data]);
                    setPage(nextPage);
                    setHasMore(data.data.length >= 10);
                }
            }
        } catch (error) {
            console.error('Error fetching research:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchResearch(true);
    };

    return (
        <div>
            {/* Search Bar */}
            <form onSubmit={handleSearch} className={styles.searchBar} style={{ marginBottom: '2rem' }}>
                <input
                    type="text"
                    placeholder="ค้นหางานวิจัย..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="form-control"
                    style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        outline: 'none',
                        fontSize: '1rem'
                    }}
                />
            </form>

            <div className={styles.itemList}>
                {research.length > 0 ? (
                    research.map((item) => (
                        <div key={item.id} className={styles.itemCard}>
                            <h4>{item.titleTh}</h4>
                            {item.titleEn && <p className={styles.itemSubtitle}>{item.titleEn}</p>}
                            <div className={styles.itemMeta}>
                                {item.year && <span className="badge badge-primary">{item.year}</span>}
                                {item.type && <span className="badge">{item.type}</span>}
                            </div>
                            {item.abstractTh && <p className={styles.itemDesc}>{item.abstractTh}</p>}
                            {item.abstractEn && <p className={`${styles.itemDesc} ${styles.bioEn}`}>{item.abstractEn}</p>}
                            {item.link && (
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className={styles.itemLink}>
                                    🔗 ดูเพิ่มเติม
                                </a>
                            )}
                        </div>
                    ))
                ) : (
                    <div className={styles.emptySection}>
                        <p>ไม่พบงานวิจัย</p>
                    </div>
                )}
            </div>

            {/* Load More */}
            {hasMore && (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button
                        onClick={() => fetchResearch(false)}
                        disabled={loading}
                        className={styles.downloadBtn}
                        style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'กำลังโหลด...' : 'โหลดเพิ่มเติม'}
                    </button>
                </div>
            )}
        </div>
    );
}
