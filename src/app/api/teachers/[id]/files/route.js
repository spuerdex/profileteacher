import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET - list files for a teacher
export async function GET(req, { params }) {
    const { id } = await params;
    const files = await prisma.teacherFile.findMany({
        where: { teacherId: parseInt(id) },
        orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(files);
}

// POST - add a new file record
export async function POST(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const teacherId = parseInt(id);

    // Check ownership or admin
    if (session.user.role === 'teacher' && session.user.teacherId !== teacherId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { fileName, fileUrl, fileSize, fileType, description } = body;

    if (!fileName || !fileUrl) {
        return NextResponse.json({ error: 'fileName and fileUrl are required' }, { status: 400 });
    }

    const file = await prisma.teacherFile.create({
        data: {
            teacherId,
            fileName,
            fileUrl,
            fileSize: fileSize || 0,
            fileType: fileType || null,
            description: description || null,
        },
    });

    return NextResponse.json(file, { status: 201 });
}
