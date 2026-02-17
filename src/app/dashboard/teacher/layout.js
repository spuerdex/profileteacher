import Sidebar from '@/components/Sidebar';
import styles from './dashboard.module.css';

export default function TeacherDashboardLayout({ children }) {
    return (
        <div className={styles.dashboardLayout}>
            <Sidebar role="teacher" />
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
