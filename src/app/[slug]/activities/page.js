import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import styles from '../profile.module.css';

export default async function ActivitiesPage({ params }) {
    const { slug } = await params;
    const teacher = await prisma.teacher.findUnique({
        where: { slug },
        include: { activities: { orderBy: { date: 'desc' } } },
    });
    if (!teacher) notFound();

    return (
        <div className={styles.content}>
            <h1 className={styles.pageTitle}>📋 กิจกรรม / Activities</h1>

            {teacher.activities.length > 0 ? (
                <div className={styles.itemList}>
                    {teacher.activities.map((item) => (
                        <div key={item.id} className={styles.itemCard}>
                            <h4>{item.titleTh}</h4>
                            {item.titleEn && <p className={styles.itemSubtitle}>{item.titleEn}</p>}
                            {item.date && (
                                <span className="badge badge-primary">
                                    {new Date(item.date).toLocaleDateString('th-TH', {
                                        year: 'numeric', month: 'long', day: 'numeric',
                                    })}
                                </span>
                            )}
                            {item.descriptionTh && <p className={styles.itemDesc}>{item.descriptionTh}</p>}
                            {item.descriptionEn && <p className={`${styles.itemDesc} ${styles.bioEn}`}>{item.descriptionEn}</p>}
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptySection}>
                    <p>ยังไม่มีข้อมูลกิจกรรม</p>
                </div>
            )}
        </div>
    );
}
