import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import styles from '../profile.module.css';

export default async function CoursesPage({ params, searchParams }) {
    const { slug } = await params;
    const { search = '' } = await searchParams;

    const teacher = await prisma.teacher.findUnique({
        where: { slug },
        include: {
            courses: {
                where: search ? {
                    OR: [
                        { nameTh: { contains: search } },
                        { nameEn: { contains: search } },
                        { codeNumber: { contains: search } },
                    ]
                } : {},
                orderBy: { createdAt: 'desc' }
            }
        },
    });
    if (!teacher) notFound();

    return (
        <div className={styles.content}>
            <div className="flex items-center justify-between mb-8">
                <h1 className={styles.pageTitle}>📚 วิชาที่สอน / Courses</h1>
            </div>

            {/* Simple Search Form */}
            <form className="flex gap-2 mb-6 max-w-md">
                <input
                    name="search"
                    className="form-input"
                    placeholder="ค้นหาวิชา..."
                    defaultValue={search}
                />
                <button type="submit" className="btn btn-secondary">🔍</button>
            </form>

            <div className="table-container shadow-sm border rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted-50">
                        <tr>
                            <th className="px-4 py-3 font-semibold text-sm border-b">รหัส</th>
                            <th className="px-4 py-3 font-semibold text-sm border-b">รายวิชา</th>
                            <th className="px-4 py-3 font-semibold text-sm border-b">ภาคเรียน</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teacher.courses.length > 0 ? (
                            teacher.courses.map((course) => (
                                <tr key={course.id} className="hover:bg-muted-50 transition-colors">
                                    <td className="px-4 py-4 border-b">
                                        {course.codeNumber ? <span className="badge badge-outline">{course.codeNumber}</span> : '-'}
                                    </td>
                                    <td className="px-4 py-4 border-b">
                                        <div className="font-medium text-primary">{course.nameTh}</div>
                                        {course.nameEn && <div className="text-sm text-muted">{course.nameEn}</div>}
                                        {course.descriptionTh && (
                                            <div className="mt-2 text-sm text-secondary bg-muted-50 p-2 rounded border-l-4 border-primary italic">
                                                {course.descriptionTh}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 border-b">
                                        <span className="text-sm">{course.semester || '-'}</span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="px-4 py-12 text-center text-muted italic">
                                    ไม่พบข้อมูลรายวิชา
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
