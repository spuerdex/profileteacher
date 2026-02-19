import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import styles from '../profile.module.css';

export default async function PublicEducationPage({ params }) {
    const { slug } = await params;

    const teacher = await prisma.teacher.findUnique({
        where: { slug },
        include: {
            education: { orderBy: { year: 'desc' } },
        },
    });

    if (!teacher) notFound();

    return (
        <div className={styles.content}>
            <h1 className={styles.pageTitle}>🎓 ประวัติการศึกษา / Education</h1>

            {teacher.education.length > 0 ? (
                <div className={styles.timeline} style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {teacher.education.map((edu) => (
                        <div key={edu.id} className={styles.timelineItem}>
                            <div className={styles.timelineDot}></div>
                            <div className={styles.timelineContent}>
                                <div className={styles.timelineHeader}>
                                    <h4 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>
                                        {edu.degree}
                                    </h4>
                                    <span className={styles.year}>{edu.year}</span>
                                </div>
                                {edu.field && (
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '1rem' }}>
                                        {edu.field}
                                    </p>
                                )}
                                {edu.institution && (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        🏢 {edu.institution}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptySection}>
                    No education records found.
                </div>
            )}
        </div>
    );
}
