import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import styles from '../profile.module.css';

export default async function PublicationsPage({ params }) {
    const { slug } = await params;
    const teacher = await prisma.teacher.findUnique({
        where: { slug },
        include: { publications: { orderBy: { year: 'desc' } } },
    });
    if (!teacher) notFound();

    return (
        <div className={styles.content}>
            <h1 className={styles.pageTitle}>📄 ผลงานตีพิมพ์ / Publications</h1>

            {teacher.publications.length > 0 ? (
                <div className={styles.itemList}>
                    {teacher.publications.map((pub) => (
                        <div key={pub.id} className={styles.itemCard}>
                            <h4>{pub.titleTh}</h4>
                            {pub.titleEn && <p className={styles.itemSubtitle}>{pub.titleEn}</p>}
                            <div className={styles.itemMeta}>
                                {pub.journal && <span className="badge">{pub.journal}</span>}
                                {pub.year && <span className="badge badge-primary">{pub.year}</span>}
                                {pub.doi && <span className="badge">DOI: {pub.doi}</span>}
                            </div>
                            {pub.link && (
                                <a href={pub.link} target="_blank" rel="noopener noreferrer" className={styles.itemLink}>
                                    🔗 ดูเพิ่มเติม
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptySection}>
                    <p>ยังไม่มีข้อมูลผลงานตีพิมพ์</p>
                </div>
            )}
        </div>
    );
}
