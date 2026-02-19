import Image from 'next/image';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
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
            articles: { orderBy: { createdAt: 'desc' }, take: 4 },
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
                    <div className={styles.heroInfo}>
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
                </div>
            </header>

            <div className={styles.content}>
                {/* Bio */}
                {/* About & Education Split Row */}
                <div className={styles.splitRow}>
                    {/* Bio */}
                    <ScrollReveal className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionIcon}>👤</span> เกี่ยวกับ
                        </h2>
                        {teacher.bioTh ? (
                            <>
                                <p className={styles.bio}>{teacher.bioTh}</p>
                                {teacher.bioEn && <p className={`${styles.bio} ${styles.bioEn}`}>{teacher.bioEn}</p>}
                            </>
                        ) : (
                            <div className={styles.emptySection}>ไม่พบข้อมูลเกี่ยวกับอาจารย์</div>
                        )}
                    </ScrollReveal>

                    {/* Education */}
                    <ScrollReveal className={styles.section} delay={200}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionIcon}>🎓</span> การศึกษา
                        </h2>
                        {teacher.education.length > 0 ? (
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
                        ) : (
                            <div className={styles.emptySection}>ไม่พบข้อมูลการศึกษา</div>
                        )}
                    </ScrollReveal>
                </div>

                {/* Articles */}
                <ScrollReveal className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionIcon}>📰</span> บทความ
                        </h2>
                        {teacher.articles.length > 0 && (
                            <Link href={`/${slug}/articles`} className={styles.viewAll}>
                                ดูทั้งหมด →
                            </Link>
                        )}
                    </div>
                    {teacher.articles.length > 0 ? (
                        <div className={styles.courseGrid}>
                            {teacher.articles.map((article) => (
                                <Link href={`/${slug}/articles/${article.id}`} key={article.id} className={styles.articleCard}>
                                    {article.coverImage && (
                                        <div className={styles.articleImageWrapper}>
                                            <Image
                                                src={article.coverImage}
                                                alt={article.title}
                                                fill
                                                className={styles.articleImage}
                                                sizes="(max-width: 768px) 100vw, 300px"
                                            />
                                        </div>
                                    )}
                                    <div className={styles.articleContent}>
                                        <h4>{article.title}</h4>
                                        <span className={styles.articleDate}>
                                            {new Date(article.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptySection}>ไม่พบข้อมูลบทความ</div>
                    )}
                </ScrollReveal>

                {/* Research Preview */}
                <ScrollReveal className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionIcon}>🔬</span> งานวิจัย
                        </h2>
                        {teacher.research.length > 0 && (
                            <Link href={`/${slug}/research`} className={styles.viewAll}>
                                ดูทั้งหมด →
                            </Link>
                        )}
                    </div>
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
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptySection}>ไม่พบข้อมูลงานวิจัย</div>
                    )}
                </ScrollReveal>

                {/* Activities Preview */}
                <ScrollReveal className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionIcon}>📋</span> กิจกรรม
                        </h2>
                        {teacher.activities.length > 0 && (
                            <Link href={`/${slug}/activities`} className={styles.viewAll}>
                                ดูทั้งหมด →
                            </Link>
                        )}
                    </div>
                    {teacher.activities.length > 0 ? (
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
                    ) : (
                        <div className={styles.emptySection}>ไม่พบข้อมูลกิจกรรม</div>
                    )}
                </ScrollReveal>

                {/* Courses Preview */}
                <ScrollReveal className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionIcon}>📚</span> วิชาที่สอน
                        </h2>
                        {teacher.courses.length > 0 && (
                            <Link href={`/${slug}/courses`} className={styles.viewAll}>
                                ดูทั้งหมด →
                            </Link>
                        )}
                    </div>
                    {teacher.courses.length > 0 ? (
                        <div className={styles.courseGrid}>
                            {teacher.courses.map((course) => (
                                <div key={course.id} className={styles.courseCard}>
                                    {course.codeNumber && <span className={styles.courseCode}>{course.codeNumber}</span>}
                                    <h4>{course.nameTh}</h4>
                                    {course.nameEn && <p className={styles.itemSubtitle}>{course.nameEn}</p>}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptySection}>ไม่พบข้อมูลรายวิชา</div>
                    )}
                </ScrollReveal>

                {/* Publications Preview */}
                <ScrollReveal className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionIcon}>📄</span> ผลงานตีพิมพ์
                        </h2>
                        {teacher.publications.length > 0 && (
                            <Link href={`/${slug}/publications`} className={styles.viewAll}>
                                ดูทั้งหมด →
                            </Link>
                        )}
                    </div>
                    {teacher.publications.length > 0 ? (
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
                    ) : (
                        <div className={styles.emptySection}>ไม่พบข้อมูลผลงานตีพิมพ์</div>
                    )}
                </ScrollReveal>
            </div>
        </>
    );
}
