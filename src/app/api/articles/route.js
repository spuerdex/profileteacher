import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/articles
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');
    const published = searchParams.get('published');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;

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
        if (published === 'true') {
            where.published = true;
        }

        const [articles, total] = await Promise.all([
            prisma.article.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.article.count({ where }),
        ]);

        return NextResponse.json({
            articles,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
    }
}

// POST /api/articles
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.teacherId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();

        // Validate required fields
        if (!data.title || !data.content) {
            return NextResponse.json({ error: 'Title and Content are required' }, { status: 400 });
        }

        const article = await prisma.article.create({
            data: {
                teacherId: session.user.teacherId,
                title: data.title,
                content: data.content,
                coverImage: data.coverImage || null,
                published: data.published !== false, // Default true
            },
        });

        return NextResponse.json(article);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
    }
}
