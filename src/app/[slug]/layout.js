import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import styles from './profile.module.css';
import ProfileNav from './ProfileNav';
import navStyles from './nav.module.css';

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

async function getTeacher(slug) {
    const teacher = await prisma.teacher.findUnique({
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
    return teacher;
}

const navItems = [
    { key: 'home', label: '🏠 หน้าแรก', labelEn: 'Home', href: '' },
    { key: 'research', label: '🔬 งานวิจัย', labelEn: 'Research', href: '/research' },
    { key: 'activities', label: '📋 กิจกรรม', labelEn: 'Activities', href: '/activities' },
    { key: 'publications', label: '📄 ผลงาน', labelEn: 'Publications', href: '/publications' },
    { key: 'courses', label: '📚 วิชาที่สอน', labelEn: 'Courses', href: '/courses' },
    { key: 'articles', label: '📰 บทความ', labelEn: 'Articles', href: '/articles' },
    { key: 'downloads', label: '📁 ดาวน์โหลด', labelEn: 'Downloads', href: '/downloads' },
    { key: 'education', label: '🎓 การศึกษา', labelEn: 'Education', href: '/education' },
    { key: 'contact', label: '📞 ติดต่อ', labelEn: 'Contact', href: '/contact' },
];

export default async function ProfileLayout({ children, params }) {
    const { slug } = await params;
    const teacher = await getTeacher(slug);

    const theme = teacher.themePreset || {
        primary: '#3b82f6', primaryLight: '#60a5fa', primaryDark: '#2563eb',
        accent: '#06b6d4', gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    };

    const fullNameTh = `${teacher.titleTh || ''} ${teacher.firstNameTh} ${teacher.lastNameTh}`.trim();

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
            {/* Navigation Bar */}
            <ProfileNav teacher={teacher} navItems={navItems} slug={slug} />

            {/* Page Content — children receive teacher data via server component */}
            <main className={styles.main}>
                {children}
            </main>

            <footer className={styles.footer}>
                <p>© {new Date().getFullYear()} {fullNameTh} — DiGi Teacher Hub</p>
                <p>Powered by: Chinnarat K. | Digital of Technology, CRRU</p>
            </footer>
        </div>
    );
}
