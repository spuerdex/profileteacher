import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const type = formData.get('type') || 'general'; // avatar, hero, general, files

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        if (type === 'files') {
            // General file upload: allow common doc types, max 20MB
            if (file.size > 20 * 1024 * 1024) {
                return NextResponse.json({ error: 'File too large. Max 20MB' }, { status: 400 });
            }
        } else {
            // Image upload: restrict to image types, max 5MB
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                return NextResponse.json({ error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' }, { status: 400 });
            }
            if (file.size > 5 * 1024 * 1024) {
                return NextResponse.json({ error: 'File too large. Max 5MB' }, { status: 400 });
            }
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create upload directory
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', type);
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Generate unique filename
        const ext = path.extname(file.name) || '.bin';
        const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
        const filepath = path.join(uploadDir, filename);

        await writeFile(filepath, buffer);

        // บังคับสิทธิ์ไฟล์เป็น 644 เพื่อให้ Nginx/Web Server อ่านได้
        try {
            const { chmod } = require('fs/promises');
            await chmod(filepath, 0o644);
        } catch (chmodError) {
            console.error('Failed to set permissions:', chmodError);
        }

        const url = `/uploads/${type}/${filename}`;

        return NextResponse.json({ url, filename });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
