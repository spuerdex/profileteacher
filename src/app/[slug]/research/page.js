import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import styles from '../profile.module.css';
import ResearchList from './ResearchList';

export default async function ResearchPage({ params }) {
    const { slug } = await params;

    // Fetch teacher first
    const teacher = await prisma.teacher.findUnique({
        where: { slug },
        select: { id: true }
    });

    if (!teacher) notFound();

    // Fetch initial research (page 1, limit 10)
    const initialResearch = await prisma.research.findMany({
        where: { teacherId: teacher.id },
        orderBy: { year: 'desc' },
        take: 10,
    });

    return (
        <div className={styles.content}>
            <h1 className={styles.pageTitle}>🔬 งานวิจัย / Research</h1>

            <ResearchList
                initialResearch={initialResearch}
                teacherId={teacher.id}
                slug={slug}
            />
        </div>
    );
}
