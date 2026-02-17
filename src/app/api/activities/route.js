import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/activities?teacherId=X
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');
    try {
        const where = teacherId ? { teacherId: parseInt(teacherId) } : {};
        const activities = await prisma.activity.findMany({ where, orderBy: { date: 'desc' } });
        return NextResponse.json(activities);
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
                teacherId, titleTh: data.titleTh, titleEn: data.titleEn || null,
                descriptionTh: data.descriptionTh || null, descriptionEn: data.descriptionEn || null,
                date: data.date ? new Date(data.date) : null, type: data.type || null,
            },
        });
        return NextResponse.json(activity, { status: 201 });
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
