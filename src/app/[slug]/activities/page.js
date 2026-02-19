import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import styles from '../profile.module.css';
import ActivityList from './ActivityList';

export default async function ActivitiesPage({ params }) {
    const { slug } = await params;
    const teacher = await prisma.teacher.findUnique({
        where: { slug },
        include: {
            activities: {
                orderBy: { date: 'desc' },
                take: 10 // Initial load limit
            }
        },
    });
    if (!teacher) notFound();

    return (
        <div className={styles.content}>
            <h1 className={styles.pageTitle}>📋 กิจกรรม / Activities</h1>
            <ActivityList initialActivities={teacher.activities} teacherId={teacher.id} />
        </div>
    );
}
