import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/research?teacherId=X&page=1&limit=10&search=keyword
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';

    // Allow explicit skip, otherwise calculate from page
    let skip = parseInt(searchParams.get('skip'));
    if (isNaN(skip)) {
        skip = (page - 1) * limit;
    }

    try {
        const where = {};

        if (teacherId) {
            where.teacherId = parseInt(teacherId);
        }

        if (search) {
            where.OR = [
                { titleTh: { contains: search } },
                { titleEn: { contains: search } },
                { abstractTh: { contains: search } },
                { abstractEn: { contains: search } },
            ];
        }

        const [research, total] = await Promise.all([
            prisma.research.findMany({
                where,
                orderBy: { year: 'desc' },
                skip,
                take: limit,
            }),
            prisma.research.count({ where }),
        ]);

        return NextResponse.json({
            data: research,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch research' }, { status: 500 });
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
