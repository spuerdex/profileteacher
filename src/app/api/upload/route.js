import { NextResponse } from 'next/server';
import { writeFile, mkdir, chmod } from 'fs/promises';
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

        // Create upload directory (relative to project root)
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', type);

        try {
            if (!existsSync(uploadDir)) {
                await mkdir(uploadDir, { recursive: true });
            }
        } catch (mkdirError) {
            console.error('Failed to create upload directory:', mkdirError);
            return NextResponse.json({ error: 'Server could not create upload folder' }, { status: 500 });
        }

        // Generate unique filename
        const ext = path.extname(file.name) || '.bin';
        const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
        const filepath = path.join(uploadDir, filename);

        try {
            await writeFile(filepath, buffer);
            // Set permissions to 644 (readable by web server)
            await chmod(filepath, 0o644);
        } catch (writeError) {
            console.error('Failed to write file or set permissions:', writeError);
            return NextResponse.json({ error: 'Failed to save file to disk' }, { status: 500 });
        }

        const url = `/api/uploads/${type}/${filename}`;

        return NextResponse.json({ url, filename });
    } catch (error) {
        console.error('Unexpected upload error:', error);
        return NextResponse.json({ error: 'Internal server error during upload' }, { status: 500 });
    }
}
