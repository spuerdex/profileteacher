import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');
    try {
        const where = teacherId ? { teacherId: parseInt(teacherId) } : {};
        const courses = await prisma.course.findMany({ where, orderBy: { semester: 'desc' } });
        return NextResponse.json(courses);
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const data = await request.json();
        const teacherId = session.user.role === 'teacher' ? session.user.teacherId : data.teacherId;
        const course = await prisma.course.create({
            data: {
                teacherId, codeNumber: data.codeNumber || null,
                nameTh: data.nameTh, nameEn: data.nameEn || null,
                semester: data.semester || null,
            },
        });
        return NextResponse.json(course, { status: 201 });
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
