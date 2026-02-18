'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styles from './files.module.css';

export default function TeacherFilesPage() {
    const { data: session } = useSession();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [description, setDescription] = useState('');

    const teacherId = session?.user?.teacherId;

    const fetchFiles = async () => {
        if (!teacherId) return;
        const res = await fetch(`/api/teachers/${teacherId}/files`);
        const data = await res.json();
        setFiles(data);
        setLoading(false);
    };

    useEffect(() => { if (teacherId) fetchFiles(); }, [teacherId]);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Max 20MB
        if (file.size > 20 * 1024 * 1024) {
            alert('ขนาดไฟล์ต้องไม่เกิน 20MB');
            return;
        }

        setUploading(true);

        // Upload to /api/upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'files');

        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
            alert('อัปโหลดไม่สำเร็จ: ' + (uploadData.error || 'Unknown error'));
            setUploading(false);
            return;
        }

        // Create file record
        await fetch(`/api/teachers/${teacherId}/files`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fileName: file.name,
                fileUrl: uploadData.url,
                fileSize: file.size,
                fileType: file.type || file.name.split('.').pop(),
                description: description || null,
            }),
        });

        setDescription('');
        setUploading(false);
        fetchFiles();
    };

    const handleDelete = async (fileId) => {
        if (!confirm('ต้องการลบไฟล์นี้?')) return;
        await fetch(`/api/teachers/${teacherId}/files/${fileId}`, { method: 'DELETE' });
        fetchFiles();
    };

    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

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

    return (
        <div>
            <h1 className={styles.title}>📁 จัดการไฟล์ดาวน์โหลด</h1>
            <p className={styles.subtitle}>อัปโหลดไฟล์เอกสารเพื่อให้ผู้เข้าชมดาวน์โหลดได้</p>

            {/* Upload Section */}
            <div className={styles.uploadCard}>
                <h3>⬆️ อัปโหลดไฟล์ใหม่</h3>
                <div className={styles.uploadForm}>
                    <input
                        type="text"
                        placeholder="คำอธิบายไฟล์ (ไม่บังคับ)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={styles.descInput}
                    />
                    <label className={styles.uploadBtn}>
                        {uploading ? '⏳ กำลังอัปโหลด...' : '📤 เลือกไฟล์ & อัปโหลด'}
                        <input
                            type="file"
                            onChange={handleUpload}
                            disabled={uploading}
                            style={{ display: 'none' }}
                        />
                    </label>
                </div>
                <p className={styles.hint}>รองรับทุกประเภทไฟล์ ขนาดสูงสุด 20MB</p>
            </div>

            {/* File List */}
            <div className={styles.fileList}>
                {loading ? (
                    <p className={styles.empty}>กำลังโหลด...</p>
                ) : files.length === 0 ? (
                    <p className={styles.empty}>ยังไม่มีไฟล์</p>
                ) : files.map(file => (
                    <div key={file.id} className={styles.fileItem}>
                        <div className={styles.fileIcon}>{getIcon(file.fileName)}</div>
                        <div className={styles.fileInfo}>
                            <strong>{file.fileName}</strong>
                            {file.description && <span className={styles.fileDesc}>{file.description}</span>}
                            <div className={styles.fileMeta}>
                                <span>{formatSize(file.fileSize)}</span>
                                <span>•</span>
                                <span>⬇️ {file.downloads} ดาวน์โหลด</span>
                                <span>•</span>
                                <span>{new Date(file.createdAt).toLocaleDateString('th-TH')}</span>
                            </div>
                        </div>
                        <div className={styles.fileActions}>
                            <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" className={styles.previewBtn}>👁️</a>
                            <button onClick={() => handleDelete(file.id)} className={styles.deleteBtn}>🗑️</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
