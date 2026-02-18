import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import styles from '../profile.module.css';

export default async function ContactPage({ params }) {
    const { slug } = await params;
    const teacher = await prisma.teacher.findUnique({
        where: { slug },
        include: { themePreset: true },
    });
    if (!teacher) notFound();

    const socialLinks = teacher.socialLinks || {};

    // Build profile URL for QR code
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = headersList.get('x-forwarded-proto') || 'http';
    const profileUrl = `${protocol}://${host}/${slug}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(profileUrl)}`;

    const fullNameTh = `${teacher.titleTh || ''} ${teacher.firstNameTh} ${teacher.lastNameTh}`.trim();
    const fullNameEn = teacher.firstNameEn
        ? `${teacher.titleEn || ''} ${teacher.firstNameEn} ${teacher.lastNameEn || ''}`.trim()
        : '';

    return (
        <div className={styles.content}>
            <h1 className={styles.pageTitle}>📞 ติดต่อ / Contact</h1>

            <div className={styles.contactGrid}>
                {/* Contact Info Card */}
                <div className={styles.contactCard}>
                    <h3>📬 ข้อมูลการติดต่อ</h3>

                    {teacher.email && (
                        <div className={styles.contactRow}>
                            <span className={styles.contactLabel}>📧 อีเมล</span>
                            <a href={`mailto:${teacher.email}`}>{teacher.email}</a>
                        </div>
                    )}

                    {teacher.phone && (
                        <div className={styles.contactRow}>
                            <span className={styles.contactLabel}>📞 โทรศัพท์</span>
                            <span>{teacher.phone}</span>
                        </div>
                    )}

                    {teacher.department && (
                        <div className={styles.contactRow}>
                            <span className={styles.contactLabel}>🏢 สังกัด</span>
                            <span>{teacher.department}</span>
                        </div>
                    )}

                    {teacher.position && (
                        <div className={styles.contactRow}>
                            <span className={styles.contactLabel}>🎓 ตำแหน่ง</span>
                            <span>{teacher.position}</span>
                        </div>
                    )}
                </div>

                {/* Social Links Card */}
                {Object.keys(socialLinks).length > 0 && (
                    <div className={styles.contactCard}>
                        <h3>🌐 ลิงก์ภายนอก</h3>
                        {socialLinks.scholar && (
                            <div className={styles.contactRow}>
                                <span className={styles.contactLabel}>📚 Google Scholar</span>
                                <a href={socialLinks.scholar} target="_blank" rel="noopener noreferrer">เปิดลิงก์</a>
                            </div>
                        )}
                        {socialLinks.orcid && (
                            <div className={styles.contactRow}>
                                <span className={styles.contactLabel}>🆔 ORCID</span>
                                <a href={socialLinks.orcid} target="_blank" rel="noopener noreferrer">{socialLinks.orcid}</a>
                            </div>
                        )}
                        {socialLinks.website && (
                            <div className={styles.contactRow}>
                                <span className={styles.contactLabel}>🔗 เว็บไซต์</span>
                                <a href={socialLinks.website} target="_blank" rel="noopener noreferrer">เปิดลิงก์</a>
                            </div>
                        )}
                        {socialLinks.linkedin && (
                            <div className={styles.contactRow}>
                                <span className={styles.contactLabel}>💼 LinkedIn</span>
                                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">เปิดลิงก์</a>
                            </div>
                        )}
                        {socialLinks.researchGate && (
                            <div className={styles.contactRow}>
                                <span className={styles.contactLabel}>🔬 ResearchGate</span>
                                <a href={socialLinks.researchGate} target="_blank" rel="noopener noreferrer">เปิดลิงก์</a>
                            </div>
                        )}
                    </div>
                )}

                {/* QR Code Card */}
                <div className={styles.contactCard}>
                    <h3>📱 QR Code</h3>
                    <p className={styles.qrSubtext}>สแกนเพื่อเปิดโปรไฟล์</p>
                    <div className={styles.qrWrap}>
                        <img
                            src={qrUrl}
                            alt={`QR Code for ${fullNameTh}`}
                            width={200}
                            height={200}
                            className={styles.qrImage}
                        />
                        <div className={styles.qrInfo}>
                            <strong>{fullNameTh}</strong>
                            {fullNameEn && <span>{fullNameEn}</span>}
                            <code className={styles.qrLink}>{profileUrl}</code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
