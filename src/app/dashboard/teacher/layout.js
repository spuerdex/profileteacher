import Sidebar from '@/components/Sidebar';
import styles from './dashboard.module.css';

export default function TeacherDashboardLayout({ children }) {
    return (
        <div className={styles.dashboardLayout}>
            <Sidebar role="teacher" />
            <div className={styles.mainWrapper}>
                <main className={styles.mainContent}>
                    {children}
                </main>
                <footer className={styles.dashboardFooter}>
                    <p>© {new Date().getFullYear()} Digital of Technology, Chiang Rai Rajabhat University</p>
                    <p>Powered by: Chinnarat K. | Computer Technical Officer</p>
                </footer>
            </div>
        </div>
    );
}
