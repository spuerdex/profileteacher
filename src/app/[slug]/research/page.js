import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import styles from '../profile.module.css';

export default async function ResearchPage({ params }) {
    const { slug } = await params;
    const teacher = await prisma.teacher.findUnique({
        where: { slug },
        include: { research: { orderBy: { year: 'desc' } } },
    });
    if (!teacher) notFound();

    return (
        <div className={styles.content}>
            <h1 className={styles.pageTitle}>🔬 งานวิจัย / Research</h1>

            {teacher.research.length > 0 ? (
                <div className={styles.itemList}>
                    {teacher.research.map((item) => (
                        <div key={item.id} className={styles.itemCard}>
                            <h4>{item.titleTh}</h4>
                            {item.titleEn && <p className={styles.itemSubtitle}>{item.titleEn}</p>}
                            <div className={styles.itemMeta}>
                                {item.year && <span className="badge badge-primary">{item.year}</span>}
                                {item.type && <span className="badge">{item.type}</span>}
                            </div>
                            {item.abstractTh && <p className={styles.itemDesc}>{item.abstractTh}</p>}
                            {item.abstractEn && <p className={`${styles.itemDesc} ${styles.bioEn}`}>{item.abstractEn}</p>}
                            {item.link && (
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className={styles.itemLink}>
                                    🔗 ดูเพิ่มเติม
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptySection}>
                    <p>ยังไม่มีข้อมูลงานวิจัย</p>
                </div>
            )}
        </div>
    );
}
