import prisma from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from '../profile.module.css';

export const dynamic = 'force-dynamic';

import ArticleList from './ArticleList';

export default async function PublicArticlesPage({ params }) {
    const { slug } = await params;

    // Fetch teacher first
    const teacher = await prisma.teacher.findUnique({
        where: { slug },
        select: { id: true }
    });

    if (!teacher) notFound();

    // Fetch initial articles (limit 12)
    const initialArticlesRaw = await prisma.article.findMany({
        where: { teacherId: teacher.id, published: true },
        orderBy: { createdAt: 'desc' },
        take: 12
    });

    const initialArticles = initialArticlesRaw.map(article => ({
        ...article,
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString(),
    }));

    return (
        <div className={styles.content}>
            <h1 className={styles.pageTitle}>📰 บทความและข่าวสาร / Articles</h1>

            <ArticleList
                initialArticles={initialArticles}
                teacherId={teacher.id}
                slug={slug}
            />
        </div>
    );
}
