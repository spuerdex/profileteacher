import Link from 'next/link';
import prisma from '@/lib/prisma';
import styles from './home.module.css';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let teachers = [];
  try {
    teachers = await prisma.teacher.findMany({
      include: { themePreset: true },
      orderBy: { firstNameTh: 'asc' },
    });
  } catch {
    // DB not ready yet
  }

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>ระบบโปรไฟล์อาจารย์</h1>
          <p className={styles.heroSubtitle}>
            Teacher Profile Management System
          </p>
        </div>
        <div className={styles.heroBg}>
          <div className={styles.glow1}></div>
          <div className={styles.glow2}></div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>อาจารย์ทั้งหมด</h2>

          {teachers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👨‍🏫</div>
              <p className="empty-state-text">ยังไม่มีข้อมูลอาจารย์ในระบบ</p>
              <Link href="/login" className="btn btn-primary">
                เข้าสู่ระบบเพื่อเพิ่มข้อมูล
              </Link>
            </div>
          ) : (
            <div className={styles.teacherGrid}>
              {teachers.map((teacher) => (
                <Link
                  key={teacher.id}
                  href={`/${teacher.slug}`}
                  className={styles.teacherCard}
                  style={{
                    '--card-accent': teacher.themePreset?.primary || '#3b82f6',
                  }}
                >
                  <div className={styles.teacherAvatar}>
                    {teacher.avatar ? (
                      <img src={teacher.avatar} alt={teacher.firstNameTh} />
                    ) : (
                      <span className={styles.avatarPlaceholder}>
                        {teacher.firstNameTh[0]}
                      </span>
                    )}
                  </div>
                  <h3 className={styles.teacherName}>
                    {teacher.titleTh || ''} {teacher.firstNameTh} {teacher.lastNameTh}
                  </h3>
                  {teacher.position && (
                    <p className={styles.teacherPosition}>{teacher.position}</p>
                  )}
                  {teacher.department && (
                    <p className={styles.teacherDept}>{teacher.department}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className={styles.footer}>
        <p>Teacher Profile System &copy; {new Date().getFullYear()}</p>
        <Link href="/login" className={styles.footerLink}>
          เข้าสู่ระบบ
        </Link>
      </footer>
    </div>
  );
}
