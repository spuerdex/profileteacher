import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function GET(request, { params }) {
    try {
        const fullPath = (await params).path;
        const relativePath = fullPath.join('/');

        // Define the absolute path to the file
        const filePath = path.join(process.cwd(), 'public', 'uploads', relativePath);

        // Security check: ensure the file is within the uploads directory
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        const resolvedPath = path.resolve(filePath);
        if (!resolvedPath.startsWith(path.resolve(uploadsDir))) {
            return new NextResponse('Forbidden', { status: 403 });
        }

        if (!existsSync(resolvedPath)) {
            return new NextResponse('Not Found', { status: 404 });
        }

        const fileBuffer = await readFile(resolvedPath);
        const ext = path.extname(resolvedPath).toLowerCase();

        // Determine content type
        const contentTypes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.webp': 'image/webp',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.pdf': 'application/pdf',
        };
        const contentType = contentTypes[ext] || 'application/octet-stream';

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('File serving error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
