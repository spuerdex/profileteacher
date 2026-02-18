import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/articles/[id]
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const article = await prisma.article.findUnique({
            where: { id: parseInt(id) },
        });

        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        return NextResponse.json(article);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
    }
}

// PUT /api/articles/[id]
export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.teacherId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const articleId = parseInt(id);

        // Verify ownership
        const existing = await prisma.article.findFirst({
            where: { id: articleId, teacherId: session.user.teacherId },
        });

        if (!existing) {
            return NextResponse.json({ error: 'Article not found or access denied' }, { status: 404 });
        }

        const data = await request.json();

        const updated = await prisma.article.update({
            where: { id: articleId },
            data: {
                title: data.title,
                content: data.content,
                coverImage: data.coverImage,
                published: data.published,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
    }
}

// DELETE /api/articles/[id]
export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.teacherId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const articleId = parseInt(id);

        // Verify ownership
        const existing = await prisma.article.findFirst({
            where: { id: articleId, teacherId: session.user.teacherId },
        });

        if (!existing) {
            return NextResponse.json({ error: 'Article not found or access denied' }, { status: 404 });
        }

        await prisma.article.delete({
            where: { id: articleId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
    }
}
