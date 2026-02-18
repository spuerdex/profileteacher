import prisma from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from '../../profile.module.css';

export const dynamic = 'force-dynamic';

async function getArticle(slug, id) {
    const teacher = await prisma.teacher.findUnique({
        where: { slug },
        select: { id: true }
    });

    if (!teacher) return null;

    const article = await prisma.article.findUnique({
        where: { id: parseInt(id) },
    });

    if (!article || article.teacherId !== teacher.id || !article.published) return null;

    return article;
}

export default async function ArticleDetailPage({ params }) {
    const { slug, id } = await params;
    const article = await getArticle(slug, id);

    if (!article) notFound();

    return (
        <div className={styles.section} style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '48px' }}>
            <Link href={`/${slug}/articles`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '20px', color: 'var(--t-primary)', fontWeight: '500' }}>
                ← กลับไปหน้ารวมบทความ
            </Link>

            <article>
                <header style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '16px' }}>{article.title}</h1>
                    <div style={{ fontSize: '0.95rem', opacity: 0.8 }}>
                        เผยแพร่เมื่อ: {new Date(article.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </header>

                {article.coverImage && (
                    <div style={{ marginBottom: '32px', borderRadius: '12px', overflow: 'hidden', maxHeight: '500px' }}>
                        <img src={article.coverImage} alt={article.title} style={{ width: '100%', objectFit: 'cover' }} />
                    </div>
                )}

                <div
                    className={styles.articleContent}
                    style={{ fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}
                >
                    {article.content}
                </div>
            </article>
        </div>
    );
}
