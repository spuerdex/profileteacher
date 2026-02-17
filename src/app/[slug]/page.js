import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import styles from './profile.module.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
    const { slug } = await params;
    try {
        const teacher = await prisma.teacher.findUnique({ where: { slug } });
        if (!teacher) return { title: 'Not Found' };
        return {
            title: `${teacher.titleTh || ''} ${teacher.firstNameTh} ${teacher.lastNameTh} | Profile`,
            description: teacher.bioTh || `โปรไฟล์ ${teacher.firstNameTh} ${teacher.lastNameTh}`,
        };
    } catch {
        return { title: 'Teacher Profile' };
    }
}

export default async function PublicProfilePage({ params }) {
    const { slug } = await params;
    let teacher;

    try {
        teacher = await prisma.teacher.findUnique({
            where: { slug },
            include: {
                themePreset: true,
                research: { orderBy: { year: 'desc' } },
                activities: { orderBy: { date: 'desc' } },
                publications: { orderBy: { year: 'desc' } },
                courses: true,
                education: { orderBy: { year: 'desc' } },
            },
        });

        if (!teacher) notFound();

        // Increment page views
        await prisma.teacher.update({
            where: { id: teacher.id },
            data: { pageViews: { increment: 1 } },
        });
    } catch {
        notFound();
    }

    const theme = teacher.themePreset || {
        primary: '#3b82f6',
        primaryLight: '#60a5fa',
        primaryDark: '#2563eb',
        accent: '#06b6d4',
        gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    };

    return (
        <div
            className={styles.container}
            style={{
                '--t-primary': theme.primary,
                '--t-primary-light': theme.primaryLight,
                '--t-primary-dark': theme.primaryDark,
                '--t-accent': theme.accent,
                '--t-gradient': theme.gradient,
            }}
        >
            {/* Hero Section */}
            <header className={styles.hero}>
                <div className={styles.heroBg}></div>
                <div className={styles.heroContent}>
                    <div className={styles.avatarWrapper}>
                        {teacher.avatar ? (
                            <img
                                src={teacher.avatar}
                                alt={teacher.firstNameTh}
                                className={styles.avatar}
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
                    {teacher.position && (
                        <p className={styles.position}>{teacher.position}</p>
                    )}
                    {teacher.department && (
                        <p className={styles.department}>{teacher.department}</p>
                    )}
                </div>
            </header>

            <main className={styles.main}>
                {/* Contact & Bio */}
                {(teacher.bioTh || teacher.email) && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionIcon}>👤</span> เกี่ยวกับ
                        </h2>
                        {teacher.bioTh && <p className={styles.bio}>{teacher.bioTh}</p>}
                        {teacher.bioEn && (
                            <p className={`${styles.bio} ${styles.bioEn}`}>{teacher.bioEn}</p>
                        )}
                        <div className={styles.contactInfo}>
                            {teacher.email && (
                                <div className={styles.contactItem}>
                                    📧 <a href={`mailto:${teacher.email}`}>{teacher.email}</a>
                                </div>
                            )}
                            {teacher.phone && (
                                <div className={styles.contactItem}>📞 {teacher.phone}</div>
                            )}
                        </div>
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

                {/* Research */}
                {teacher.research.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionIcon}>🔬</span> งานวิจัย
                        </h2>
                        <div className={styles.itemList}>
                            {teacher.research.map((item) => (
                                <div key={item.id} className={styles.itemCard}>
                                    <h4>{item.titleTh}</h4>
                                    {item.titleEn && (
                                        <p className={styles.itemSubtitle}>{item.titleEn}</p>
                                    )}
                                    <div className={styles.itemMeta}>
                                        {item.year && <span className="badge badge-primary">{item.year}</span>}
                                        {item.type && <span className="badge">{item.type}</span>}
                                    </div>
                                    {item.abstractTh && (
                                        <p className={styles.itemDesc}>{item.abstractTh}</p>
                                    )}
                                    {item.link && (
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.itemLink}
                                        >
                                            🔗 ดูเพิ่มเติม
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Activities */}
                {teacher.activities.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionIcon}>📋</span> กิจกรรม
                        </h2>
                        <div className={styles.itemList}>
                            {teacher.activities.map((item) => (
                                <div key={item.id} className={styles.itemCard}>
                                    <h4>{item.titleTh}</h4>
                                    {item.titleEn && (
                                        <p className={styles.itemSubtitle}>{item.titleEn}</p>
                                    )}
                                    {item.date && (
                                        <span className="badge badge-primary">
                                            {new Date(item.date).toLocaleDateString('th-TH', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    )}
                                    {item.descriptionTh && (
                                        <p className={styles.itemDesc}>{item.descriptionTh}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Courses */}
                {teacher.courses.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionIcon}>📚</span> วิชาที่สอน
                        </h2>
                        <div className={styles.courseGrid}>
                            {teacher.courses.map((course) => (
                                <div key={course.id} className={styles.courseCard}>
                                    {course.codeNumber && (
                                        <span className={styles.courseCode}>{course.codeNumber}</span>
                                    )}
                                    <h4>{course.nameTh}</h4>
                                    {course.nameEn && (
                                        <p className={styles.itemSubtitle}>{course.nameEn}</p>
                                    )}
                                    {course.semester && (
                                        <span className="badge">{course.semester}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Publications */}
                {teacher.publications.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionIcon}>📄</span> ผลงานตีพิมพ์
                        </h2>
                        <div className={styles.itemList}>
                            {teacher.publications.map((pub) => (
                                <div key={pub.id} className={styles.itemCard}>
                                    <h4>{pub.titleTh}</h4>
                                    {pub.titleEn && (
                                        <p className={styles.itemSubtitle}>{pub.titleEn}</p>
                                    )}
                                    <div className={styles.itemMeta}>
                                        {pub.journal && <span className="badge">{pub.journal}</span>}
                                        {pub.year && <span className="badge badge-primary">{pub.year}</span>}
                                    </div>
                                    {pub.link && (
                                        <a href={pub.link} target="_blank" rel="noopener noreferrer" className={styles.itemLink}>
                                            🔗 ดูเพิ่มเติม
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <footer className={styles.footer}>
                <p>Teacher Profile System</p>
            </footer>
        </div>
    );
}
