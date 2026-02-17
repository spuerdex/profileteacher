import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/research?teacherId=X
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');

    try {
        const where = teacherId ? { teacherId: parseInt(teacherId) } : {};
        const research = await prisma.research.findMany({
            where,
            orderBy: { year: 'desc' },
        });
        return NextResponse.json(research);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

// POST /api/research
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await request.json();
        const teacherId = session.user.role === 'teacher' ? session.user.teacherId : data.teacherId;

        const research = await prisma.research.create({
            data: {
                teacherId,
                titleTh: data.titleTh,
                titleEn: data.titleEn || null,
                abstractTh: data.abstractTh || null,
                abstractEn: data.abstractEn || null,
                year: data.year ? parseInt(data.year) : null,
                type: data.type || null,
                link: data.link || null,
            },
        });

        return NextResponse.json(research, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
    }
}
