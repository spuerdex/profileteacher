import Image from 'next/image';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import styles from './home.module.css';
import TeacherGrid from './TeacherGrid';

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

  // Count departments
  const departments = new Set(teachers.map(t => t.department).filter(Boolean));

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>DiGiT Teacher Hub</h1>
          <p className={styles.heroSubtitle}>
            ระบบโปรไฟล์อาจารย์ | Digital Faculty Profile Platform
          </p>
          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{teachers.length}</span>
              <span className={styles.statLabel}>อาจารย์</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{departments.size}</span>
              <span className={styles.statLabel}>สาขาวิชา</span>
            </div>
          </div>
        </div>
        <div className={styles.heroBg}>
          <div className={styles.glow1}></div>
          <div className={styles.glow2}></div>
        </div>
      </header>

      <main className={styles.main}>
        <TeacherGrid teachers={JSON.parse(JSON.stringify(teachers))} />
      </main>

      <footer className={styles.footer}>
        <p>DiGiT Teacher Hub &copy; {new Date().getFullYear()}</p>
        <Link href="/login" className={styles.footerLink}>
          เข้าสู่ระบบ
        </Link>
      </footer>
    </div>
  );
}
