import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import styles from '../profile.module.css';

export default async function DownloadsPage({ params }) {
    const { slug } = await params;
    const teacher = await prisma.teacher.findUnique({
        where: { slug },
        include: { files: { orderBy: { createdAt: 'desc' } } },
    });
    if (!teacher) notFound();

    const getIcon = (name) => {
        const ext = name?.split('.').pop()?.toLowerCase();
        if (['pdf'].includes(ext)) return '📄';
        if (['doc', 'docx'].includes(ext)) return '📝';
        if (['xls', 'xlsx'].includes(ext)) return '📊';
        if (['ppt', 'pptx'].includes(ext)) return '📽️';
        if (['zip', 'rar', '7z'].includes(ext)) return '📦';
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return '🖼️';
        return '📎';
    };

    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className={styles.content}>
            <h1 className={styles.pageTitle}>📁 ดาวน์โหลดเอกสาร / Downloads</h1>

            {teacher.files.length === 0 ? (
                <div className={styles.emptySection}>ยังไม่มีไฟล์สำหรับดาวน์โหลด</div>
            ) : (
                <div className={styles.downloadList}>
                    {teacher.files.map(file => (
                        <a
                            key={file.id}
                            href={file.fileUrl}
                            download={file.fileName}
                            className={styles.downloadItem}
                        >
                            <div className={styles.downloadIcon}>{getIcon(file.fileName)}</div>
                            <div className={styles.downloadInfo}>
                                <strong>{file.fileName}</strong>
                                {file.description && <span className={styles.downloadDesc}>{file.description}</span>}
                                <div className={styles.downloadMeta}>
                                    <span>{formatSize(file.fileSize)}</span>
                                    <span>•</span>
                                    <span>⬇️ {file.downloads}</span>
                                    <span>•</span>
                                    <span>{new Date(file.createdAt).toLocaleDateString('th-TH')}</span>
                                </div>
                            </div>
                            <div className={styles.downloadBtn}>⬇️ ดาวน์โหลด</div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
