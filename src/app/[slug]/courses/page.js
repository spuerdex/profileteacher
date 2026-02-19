import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import styles from '../profile.module.css';
import CourseList from './CourseList';

export default async function CoursesPage({ params }) {
    const { slug } = await params;

    const teacher = await prisma.teacher.findUnique({
        where: { slug },
        include: {
            courses: {
                orderBy: { createdAt: 'desc' },
                take: 10 // Initial load limit
            }
        },
    });
    if (!teacher) notFound();

    return (
        <div className={styles.content}>
            <h1 className={styles.pageTitle}>📚 วิชาที่สอน / Courses</h1>

            <CourseList initialCourses={teacher.courses} teacherId={teacher.id} />
        </div>
    );
}
