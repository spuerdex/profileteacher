import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/activities?teacherId=X
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
                { titleTh: { contains: search } },
                { titleEn: { contains: search } },
                { descriptionTh: { contains: search } },
                { descriptionEn: { contains: search } },
            ];
        }

        const [activities, total] = await Promise.all([
            prisma.activity.findMany({
                where,
                orderBy: { date: 'desc' },
                skip,
                take: limit,
            }),
            prisma.activity.count({ where }),
        ]);

        return NextResponse.json({
            data: activities,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
        });
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

// POST /api/activities
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const data = await request.json();
        const teacherId = session.user.role === 'teacher' ? session.user.teacherId : data.teacherId;
        const activity = await prisma.activity.create({
            data: {
                teacherId,
                titleTh: data.titleTh,
                titleEn: data.titleEn || null,
                descriptionTh: data.descriptionTh || null,
                descriptionEn: data.descriptionEn || null,
                date: data.date ? new Date(data.date) : null,
                type: data.type || null,
            },
        });
        return NextResponse.json(activity, { status: 201 });
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
