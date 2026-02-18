import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// DELETE - remove a file record
export async function DELETE(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id, fileId } = await params;
    const teacherId = parseInt(id);

    if (session.user.role === 'teacher' && session.user.teacherId !== teacherId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.teacherFile.delete({ where: { id: parseInt(fileId) } });
    return NextResponse.json({ success: true });
}

// PATCH - increment download count (public)
export async function PATCH(req, { params }) {
    const { fileId } = await params;
    const file = await prisma.teacherFile.update({
        where: { id: parseInt(fileId) },
        data: { downloads: { increment: 1 } },
    });
    return NextResponse.json({ downloads: file.downloads });
}
