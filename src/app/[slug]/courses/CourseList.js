'use client';

import { useState } from 'react';
import styles from '../profile.module.css';

export default function CourseList({ initialCourses, teacherId }) {
    const [courses, setCourses] = useState(initialCourses || []);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState((initialCourses?.length || 0) >= 10);
    const [search, setSearch] = useState('');

    const fetchCourses = async (reset = false) => {
        setLoading(true);
        const nextPage = reset ? 1 : page + 1;
        const currentSearch = search;

        try {
            const res = await fetch(
                `/api/courses?teacherId=${teacherId}&page=${nextPage}&limit=10&search=${encodeURIComponent(currentSearch)}`
            );
            const data = await res.json();

            if (data.data) {
                if (reset) {
                    setCourses(data.data);
                    setPage(1);
                    setHasMore(data.data.length >= 10);
                } else {
                    setCourses((prev) => [...prev, ...data.data]);
                    setPage(nextPage);
                    setHasMore(data.data.length >= 10);
                }
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCourses(true);
    };

    return (
        <div>
            {/* Search Bar */}
            <form onSubmit={handleSearch} className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="ค้นหาวิชา..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    type="submit"
                    className={styles.searchBtn}
                >
                    🔍 ค้นหา
                </button>
            </form>

            {/* Table Layout */}
            <div className="table-responsive" style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', width: '15%' }}>รหัสวิชา</th>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', width: '40%' }}>ชื่อวิชา</th>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', width: '30%' }}>รายละเอียด</th>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', width: '15%' }}>ภาคเรียน</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.length > 0 ? (
                            courses.map((course) => (
                                <tr key={course.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '16px', verticalAlign: 'top' }}>
                                        {course.codeNumber ? (
                                            <span className="badge" style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                                                {course.codeNumber}
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td style={{ padding: '16px', verticalAlign: 'top' }}>
                                        <div style={{ fontWeight: '600', color: 'var(--t-primary, var(--primary))', marginBottom: '4px' }}>
                                            {course.nameTh}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', verticalAlign: 'top' }}>
                                        {course.descriptionTh ? (
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                                {course.descriptionTh}
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td style={{ padding: '16px', verticalAlign: 'top' }}>
                                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                            {course.semester || '-'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    ไม่พบข้อมูลรายวิชา
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Load More */}
            {hasMore && (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button
                        onClick={() => fetchCourses(false)}
                        disabled={loading}
                        className={styles.searchBtn}
                        style={{ margin: '0 auto', opacity: loading ? 0.7 : 1, width: 'auto' }}
                    >
                        {loading ? 'กำลังโหลด...' : 'โหลดเพิ่มเติม'}
                    </button>
                </div>
            )}
        </div>
    );
}
