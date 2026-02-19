import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import styles from '../profile.module.css';
import DownloadItem from './DownloadItem';

export default async function DownloadsPage({ params }) {
    const { slug } = await params;
    const teacher = await prisma.teacher.findUnique({
        where: { slug },
        include: { files: { orderBy: { createdAt: 'desc' } } },
    });
    if (!teacher) notFound();

    return (
        <div className={styles.content}>
            <h1 className={styles.pageTitle}>📁 ดาวน์โหลดเอกสาร / Downloads</h1>

            {teacher.files.length === 0 ? (
                <div className={styles.emptySection}>ยังไม่มีไฟล์สำหรับดาวน์โหลด</div>
            ) : (
                <div className={styles.downloadList}>
                    {teacher.files.map(file => (
                        <DownloadItem
                            key={file.id}
                            file={file}
                            teacherId={teacher.id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
