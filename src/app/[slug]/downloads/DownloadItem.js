'use client';

import { useState } from 'react';
import styles from '../profile.module.css';

export default function DownloadItem({ file, teacherId }) {
    const [downloadCount, setDownloadCount] = useState(file.downloads);

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
        if (!bytes) return '0 B';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const handleDownload = async (e) => {
        // Increment download count via API
        try {
            const res = await fetch(`/api/teachers/${teacherId}/files/${file.id}`, {
                method: 'PATCH',
            });
            if (res.ok) {
                const data = await res.json();
                setDownloadCount(data.downloads);
            }
        } catch (error) {
            console.error('Failed to increment download count:', error);
        }
        // The browser will handle the download because of the href and download attributes
    };

    return (
        <a
            href={file.fileUrl}
            download={file.fileName}
            className={styles.downloadItem}
            onClick={handleDownload}
            target="_blank"
            rel="noopener noreferrer"
        >
            <div className={styles.downloadIcon}>{getIcon(file.fileName)}</div>
            <div className={styles.downloadInfo}>
                <strong>{file.fileName}</strong>
                {file.description && <span className={styles.downloadDesc}>{file.description}</span>}
                <div className={styles.downloadMeta}>
                    <span>{formatSize(file.fileSize)}</span>
                    <span>•</span>
                    <span>⬇️ {downloadCount}</span>
                    <span>•</span>
                    <span>{new Date(file.createdAt).toLocaleDateString('th-TH')}</span>
                </div>
            </div>
            <div className={styles.downloadBtn}>⬇️ ดาวน์โหลด</div>
        </a>
    );
}
