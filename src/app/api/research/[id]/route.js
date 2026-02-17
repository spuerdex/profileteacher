import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// PUT /api/research/[id]
export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const data = await request.json();

        const item = await prisma.research.update({
            where: { id: parseInt(id) },
            data: {
                titleTh: data.titleTh,
                titleEn: data.titleEn || null,
                abstractTh: data.abstractTh || null,
                abstractEn: data.abstractEn || null,
                year: data.year ? parseInt(data.year) : null,
                type: data.type || null,
                link: data.link || null,
            },
        });

        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}

// DELETE /api/research/[id]
export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        await prisma.research.delete({ where: { id: parseInt(id) } });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
