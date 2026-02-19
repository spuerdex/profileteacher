import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    try {
        const where = {};
        if (teacherId) where.teacherId = parseInt(teacherId);
        if (search) {
            where.OR = [
                { nameTh: { contains: search } },
                { nameEn: { contains: search } },
                { codeNumber: { contains: search } },
            ];
        }

        const [courses, total] = await Promise.all([
            prisma.course.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.course.count({ where }),
        ]);

        return NextResponse.json({
            data: courses,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
        });
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
                teacherId,
                codeNumber: data.codeNumber || null,
                nameTh: data.nameTh,
                nameEn: data.nameEn || null,
                descriptionTh: data.descriptionTh || null,
                semester: data.semester || null,
            },
        });
        return NextResponse.json(course, { status: 201 });
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
