import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const { id } = await params;
        const data = await request.json();
        const item = await prisma.publication.update({
            where: { id: parseInt(id) },
            data: { titleTh: data.titleTh, titleEn: data.titleEn || null, journal: data.journal || null, year: data.year ? parseInt(data.year) : null, link: data.link || null },
        });
        return NextResponse.json(item);
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const { id } = await params;
        await prisma.publication.delete({ where: { id: parseInt(id) } });
        return NextResponse.json({ success: true });
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
