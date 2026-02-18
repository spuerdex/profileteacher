'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../profile.module.css';

export default function ArticleList({ initialArticles, teacherId, slug }) {
    const [articles, setArticles] = useState(initialArticles);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialArticles.length >= 12);

    const loadMore = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const skip = articles.length;
            const res = await fetch(`/api/articles?teacherId=${teacherId}&published=true&skip=${skip}&limit=8`);
            const data = await res.json();

            if (data.articles && data.articles.length > 0) {
                // Filter out any potential duplicates just in case
                const newArticles = data.articles.filter(newArt =>
                    !articles.some(existing => existing.id === newArt.id)
                );

                if (newArticles.length > 0) {
                    setArticles([...articles, ...newArticles]);
                }

                if (data.articles.length < 8) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Failed to load more articles', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className={styles.articleGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
                {articles.map((article) => (
                    <Link href={`/${slug}/articles/${article.id}`} key={article.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className={styles.itemCard} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            {article.coverImage && (
                                <div style={{ height: '200px', overflow: 'hidden', borderRadius: '8px 8px 0 0', margin: '-20px -20px 16px -20px' }}>
                                    <img src={article.coverImage} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            )}
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '8px', lineHeight: '1.4' }}>{article.title}</h3>
                            <div style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '12px' }}>
                                {new Date(article.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                            <p style={{ fontSize: '0.95rem', opacity: 0.9, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
                                {article.content}
                            </p>
                            <span style={{ marginTop: '16px', color: 'var(--t-primary)', fontWeight: '600', fontSize: '0.9rem' }}>อ่านเพิ่มเติม →</span>
                        </div>
                    </Link>
                ))}
            </div>

            {hasMore ? (
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        style={{
                            padding: '10px 24px',
                            background: 'transparent',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-primary)',
                            borderRadius: '24px',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            transition: 'all 0.2s',
                            opacity: loading ? 0.7 : 1
                        }}
                        onMouseOver={(e) => e.target.style.borderColor = 'var(--t-primary)'}
                        onMouseOut={(e) => e.target.style.borderColor = 'var(--border-color)'}
                    >
                        {loading ? 'กำลังโหลด...' : 'โหลดเพิ่มเติม'}
                    </button>
                </div>
            ) : (
                articles.length > 0 && (
                    <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        ไม่มีบทความเพิ่มเติมแล้ว
                    </div>
                )
            )}

            {articles.length === 0 && (
                <div className={styles.emptySection}>
                    ยังไม่มีบทความ
                </div>
            )}
        </>
    );
}
