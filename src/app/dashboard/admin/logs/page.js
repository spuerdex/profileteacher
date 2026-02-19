'use client';

import { useState, useEffect } from 'react';
import styles from './logs.module.css';

export default function AdminLogsPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const limit = 20;

    const fetchLogs = async (p = 1) => {
        setLoading(true);
        const res = await fetch(`/api/admin/logs?page=${p}&limit=${limit}`);
        const data = await res.json();
        setLogs(data.logs || []);
        setTotal(data.total || 0);
        setPage(p);
        setLoading(false);
    };

    useEffect(() => { fetchLogs(); }, []);

    const totalPages = Math.ceil(total / limit);

    const formatDate = (d) => {
        if (!d) return '-';
        return new Date(d).toLocaleString('th-TH', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    return (
        <div>
            <div className="page-header">
                <div className="flex flex-col sm-flex-row items-start sm-items-center justify-between gap-md">
                    <div>
                        <h1 className="page-title">📊 Activity Logs</h1>
                        <p className="page-subtitle">ดูกิจกรรมล่าสุดของอาจารย์ในระบบ ({total} รายการ)</p>
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>อาจารย์</th>
                            <th>อีเมล</th>
                            <th>เข้าชม</th>
                            <th>สร้างเมื่อ</th>
                            <th>อัปเดตล่าสุด</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className={styles.empty}>กำลังโหลด...</td></tr>
                        ) : logs.length === 0 ? (
                            <tr><td colSpan={5} className={styles.empty}>ไม่มีข้อมูล</td></tr>
                        ) : logs.map(log => (
                            <tr key={log.id}>
                                <td className={styles.name}>{log.teacher}</td>
                                <td className={styles.email}>{log.email || '-'}</td>
                                <td className={styles.views}>{log.pageViews}</td>
                                <td>{formatDate(log.createdAt)}</td>
                                <td>{formatDate(log.updatedAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button disabled={page <= 1} onClick={() => fetchLogs(page - 1)}>← ก่อนหน้า</button>
                    <span>หน้า {page} / {totalPages}</span>
                    <button disabled={page >= totalPages} onClick={() => fetchLogs(page + 1)}>ถัดไป →</button>
                </div>
            )}
        </div>
    );
}
