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
                { titleTh: { contains: search } },
                { titleEn: { contains: search } },
                { journal: { contains: search } },
            ];
        }

        const [publications, total] = await Promise.all([
            prisma.publication.findMany({
                where,
                orderBy: { year: 'desc' },
                skip,
                take: limit,
            }),
            prisma.publication.count({ where }),
        ]);

        return NextResponse.json({
            data: publications,
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
        const pub = await prisma.publication.create({
            data: {
                teacherId, titleTh: data.titleTh, titleEn: data.titleEn || null,
                journal: data.journal || null, year: data.year ? parseInt(data.year) : null,
                doi: data.doi || null, link: data.link || null,
            },
        });
        return NextResponse.json(pub, { status: 201 });
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
