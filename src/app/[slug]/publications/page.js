import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import styles from '../profile.module.css';
import PublicationList from './PublicationList';

export default async function PublicationsPage({ params }) {
    const { slug } = await params;
    const teacher = await prisma.teacher.findUnique({
        where: { slug },
        include: {
            publications: {
                orderBy: { year: 'desc' },
                take: 5 // Initial load limit
            }
        },
    });
    if (!teacher) notFound();

    return (
        <div className={styles.content}>
            <h1 className={styles.pageTitle}>📄 ผลงานตีพิมพ์ / Publications</h1>
            <PublicationList initialPublications={teacher.publications} teacherId={teacher.id} />
        </div>
    );
}
