import Image from 'next/image';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import styles from './profile.module.css';

export default async function ProfileHomePage({ params }) {
    const { slug } = await params;

    const teacher = await prisma.teacher.findUnique({
        where: { slug },
        include: {
            themePreset: true,
            research: { orderBy: { year: 'desc' }, take: 3 },
            activities: { orderBy: { date: 'desc' }, take: 3 },
            publications: { orderBy: { year: 'desc' }, take: 3 },
            courses: { take: 4 },
            education: { orderBy: { year: 'desc' } },
        },
    });

    if (!teacher) notFound();

    // Increment page views
    await prisma.teacher.update({
        where: { id: teacher.id },
        data: { pageViews: { increment: 1 } },
    });

    return (
        <>
            {/* Hero Section */}
            <header className={styles.hero}>
                <div className={styles.heroBg}></div>
                {teacher.heroImage && (
                    <Image
                        src={teacher.heroImage}
                        alt="Background"
                        fill
                        className={styles.heroBgImage}
                        priority
                    />
                )}
                <div className={styles.heroContent}>
                    <div className={styles.avatarWrapper}>
                        {teacher.avatar ? (
                            <Image
                                src={teacher.avatar}
                                alt={teacher.firstNameTh}
                                fill
                                className={styles.avatarImage}
                                sizes="130px"
                            />
                        ) : (
                            <div className={styles.avatarPlaceholder}>
                                {teacher.firstNameTh[0]}
                            </div>
                        )}
                    </div>
                    <h1 className={styles.name}>
                        {teacher.titleTh || ''} {teacher.firstNameTh} {teacher.lastNameTh}
                    </h1>
                    {(teacher.titleEn || teacher.firstNameEn) && (
                        <p className={styles.nameEn}>
                            {teacher.titleEn || ''} {teacher.firstNameEn || ''} {teacher.lastNameEn || ''}
                        </p>
                    )}
                    {teacher.position && <p className={styles.position}>{teacher.position}</p>}
                    {teacher.department && <p className={styles.department}>{teacher.department}</p>}
                </div>
            </header>

            <div className={styles.content}>
                {/* Bio */}
                {teacher.bioTh && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionIcon}>👤</span> เกี่ยวกับ
                        </h2>
                        <p className={styles.bio}>{teacher.bioTh}</p>
                        {teacher.bioEn && <p className={`${styles.bio} ${styles.bioEn}`}>{teacher.bioEn}</p>}
                    </section>
                )}

                {/* Education */}
                {teacher.education.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionIcon}>🎓</span> การศึกษา
                        </h2>
                        <div className={styles.timeline}>
                            {teacher.education.map((edu) => (
                                <div key={edu.id} className={styles.timelineItem}>
                                    <div className={styles.timelineDot}></div>
                                    <div className={styles.timelineContent}>
                                        <h4>{edu.degree} {edu.field ? `— ${edu.field}` : ''}</h4>
                                        {edu.institution && <p>{edu.institution}</p>}
                                        {edu.year && <span className={styles.year}>{edu.year}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Research Preview */}
                {teacher.research.length > 0 && (
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>🔬</span> งานวิจัย
                            </h2>
                            <Link href={`/${slug}/research`} className={styles.viewAll}>
                                ดูทั้งหมด →
                            </Link>
                        </div>
                        <div className={styles.itemList}>
                            {teacher.research.map((item) => (
                                <div key={item.id} className={styles.itemCard}>
                                    <h4>{item.titleTh}</h4>
                                    {item.titleEn && <p className={styles.itemSubtitle}>{item.titleEn}</p>}
                                    <div className={styles.itemMeta}>
                                        {item.year && <span className="badge badge-primary">{item.year}</span>}
                                        {item.type && <span className="badge">{item.type}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Activities Preview */}
                {teacher.activities.length > 0 && (
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>📋</span> กิจกรรม
                            </h2>
                            <Link href={`/${slug}/activities`} className={styles.viewAll}>
                                ดูทั้งหมด →
                            </Link>
                        </div>
                        <div className={styles.itemList}>
                            {teacher.activities.map((item) => (
                                <div key={item.id} className={styles.itemCard}>
                                    <h4>{item.titleTh}</h4>
                                    {item.date && (
                                        <span className="badge badge-primary">
                                            {new Date(item.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Courses Preview */}
                {teacher.courses.length > 0 && (
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>📚</span> วิชาที่สอน
                            </h2>
                            <Link href={`/${slug}/courses`} className={styles.viewAll}>
                                ดูทั้งหมด →
                            </Link>
                        </div>
                        <div className={styles.courseGrid}>
                            {teacher.courses.map((course) => (
                                <div key={course.id} className={styles.courseCard}>
                                    {course.codeNumber && <span className={styles.courseCode}>{course.codeNumber}</span>}
                                    <h4>{course.nameTh}</h4>
                                    {course.nameEn && <p className={styles.itemSubtitle}>{course.nameEn}</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Publications Preview */}
                {teacher.publications.length > 0 && (
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>📄</span> ผลงานตีพิมพ์
                            </h2>
                            <Link href={`/${slug}/publications`} className={styles.viewAll}>
                                ดูทั้งหมด →
                            </Link>
                        </div>
                        <div className={styles.itemList}>
                            {teacher.publications.map((pub) => (
                                <div key={pub.id} className={styles.itemCard}>
                                    <h4>{pub.titleTh}</h4>
                                    <div className={styles.itemMeta}>
                                        {pub.journal && <span className="badge">{pub.journal}</span>}
                                        {pub.year && <span className="badge badge-primary">{pub.year}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}
