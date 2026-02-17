import Sidebar from '@/components/Sidebar';
import styles from './dashboard.module.css';

export default function AdminDashboardLayout({ children }) {
    return (
        <div className={styles.dashboardLayout}>
            <Sidebar role="admin" />
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
