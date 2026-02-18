import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import styles from '../profile.module.css';

export default async function CoursesPage({ params }) {
    const { slug } = await params;
    const teacher = await prisma.teacher.findUnique({
        where: { slug },
        include: { courses: true },
    });
    if (!teacher) notFound();

    return (
        <div className={styles.content}>
            <h1 className={styles.pageTitle}>📚 วิชาที่สอน / Courses</h1>

            {teacher.courses.length > 0 ? (
                <div className={styles.courseGrid}>
                    {teacher.courses.map((course) => (
                        <div key={course.id} className={styles.courseCard}>
                            {course.codeNumber && <span className={styles.courseCode}>{course.codeNumber}</span>}
                            <h4>{course.nameTh}</h4>
                            {course.nameEn && <p className={styles.itemSubtitle}>{course.nameEn}</p>}
                            {course.semester && <span className="badge">{course.semester}</span>}
                            {course.descriptionTh && <p className={styles.itemDesc}>{course.descriptionTh}</p>}
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptySection}>
                    <p>ยังไม่มีข้อมูลวิชาที่สอน</p>
                </div>
            )}
        </div>
    );
}
