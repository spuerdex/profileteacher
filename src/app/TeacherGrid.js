'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './home.module.css';

export default function TeacherGrid({ teachers }) {
    const [search, setSearch] = useState('');

    const filtered = teachers.filter((t) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        const fullName = `${t.titleTh || ''} ${t.firstNameTh} ${t.lastNameTh}`.toLowerCase();
        const fullNameEn = `${t.titleEn || ''} ${t.firstNameEn || ''} ${t.lastNameEn || ''}`.toLowerCase();
        const dept = (t.department || '').toLowerCase();
        const pos = (t.position || '').toLowerCase();
        return fullName.includes(q) || fullNameEn.includes(q) || dept.includes(q) || pos.includes(q);
    });

    return (
        <section>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                    👨‍🏫 อาจารย์ทั้งหมด
                    <span className={styles.sectionCount}>{filtered.length} คน</span>
                </h2>
                <div className={styles.searchWrapper}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="ค้นหาอาจารย์..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {teachers.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>👨‍🏫</div>
                    <p className={styles.emptyText}>ยังไม่มีข้อมูลอาจารย์ในระบบ</p>
                    <Link href="/login" className="btn btn-primary">
                        เข้าสู่ระบบเพื่อเพิ่มข้อมูล
                    </Link>
                </div>
            ) : filtered.length === 0 ? (
                <div className={styles.noResults}>
                    ไม่พบอาจารย์ที่ตรงกับ &quot;{search}&quot;
                </div>
            ) : (
                <div className={styles.teacherGrid}>
                    {filtered.map((teacher) => (
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
                                    <Image
                                        src={teacher.avatar}
                                        alt={teacher.firstNameTh}
                                        fill
                                        className={styles.avatarImage}
                                        sizes="90px"
                                    />
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
    );
}
