'use client';

import Link from 'next/link';

export default function CookiePolicyPage() {
    return (
        <main style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', color: '#444', backgroundColor: '#fff', minHeight: '100vh' }}>
            <Link href="/" style={{ color: '#3b82f6', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block', fontWeight: '500' }}>
                ← กลับหน้าหลัก
            </Link>

            <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#111', fontWeight: '800' }}>นโยบายการใช้คุกกี้ (Cookie Policy)</h1>

            <section style={{ marginBottom: '2.5rem' }}>
                <p style={{ lineHeight: '1.7', fontSize: '1.1rem' }}>
                    เว็บไซต์ของเรามีการใช้งานคุกกี้ (Cookies) เพื่อมอบประสบการณ์การใช้งานที่ดีที่สุดให้กับคุณ
                    การใช้งานเว็บไซต์นี้อย่างต่อเนื่องถือว่าคุณยอมรับการใช้งานคุกกี้ตามนโนบายนี้
                </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#222' }}>คุกกี้คืออะไร?</h2>
                <p style={{ lineHeight: '1.7' }}>
                    คุกกี้คือไฟล์ข้อความขนาดเล็กที่ถูกจัดเก็บไว้ในเบราว์เซอร์หรืออุปกรณ์ของคุณเมื่อคุณเข้าเยี่ยมชมเว็บไซต์
                    ช่วยให้เว็บไซต์สามารถจดจำการตั้งค่าและประวัติการใช้งานของคุณได้
                </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#222' }}>ประเภทของคุกกี้ที่เราใช้</h2>
                <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                    <li>
                        <strong>คุกกี้ที่จำเป็น (Strictly Necessary Cookies):</strong>
                        จำเป็นต่อการทำงานของเว็บไซต์ เพื่อให้คุณสามารถใช้งานฟีเจอร์ต่างๆ เช่น การเข้าสู่ระบบ
                    </li>
                    <li>
                        <strong>คุกกี้เพื่อการปรับแต่ง (Functional Cookies):</strong>
                        ช่วยให้จดจำการตั้งค่าของคุณ เช่น ภาษาที่เลือก หรือโหมดการแสดงผล (Light/Dark Mode)
                    </li>
                    <li>
                        <strong>คุกกี้เพื่อการวิเคราะห์ (Analytics Cookies):</strong>
                        ใช้เพื่อเก็บข้อมูลทางสถิติการเข้าใช้งาน เพื่อนำมาปรับปรุงประสิทธิภาพของเว็บไซต์
                    </li>
                </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#222' }}>การจัดการคุกกี้</h2>
                <p style={{ lineHeight: '1.7' }}>
                    คุณสามารถเลือกที่จะปฏิเสธหรือลบคุกกี้ได้ผ่านการตั้งค่าในเบราว์เซอร์ของคุณ
                    อย่างไรก็ตาม การปิดการใช้งานคุกกี้บางประเภทอาจส่งผลต่อการใช้งานฟีเจอร์บางอย่างในเว็บไซต์
                </p>
            </section>

            <footer style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #eee', fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
                <p style={{ marginBottom: '1rem', fontStyle: 'italic', color: '#2563eb', fontWeight: '500' }}>
                    ✨ คณะเทคโนโลยีดิจิทัล : “สร้างสรรค์นวัตกรรมด้านคอมพิวเตอร์และเทคโนโลยีสารสนเทศในระดับท้องถิ่นสู่สากล” ✨
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                    #คณะเทคโนโลยีดิจทัล #มหาวิทยาลัยราชภัฏเชียงราย #CRRU
                </p>
                <div style={{ marginTop: '1rem', opacity: 0.7 }}>
                    อัปเดตล่าสุดเมื่อ: 20 กุมภาพันธ์ 2569
                </div>
            </footer>
        </main>
    );
}
