import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');
    try {
        const where = teacherId ? { teacherId: parseInt(teacherId) } : {};
        const publications = await prisma.publication.findMany({ where, orderBy: { year: 'desc' } });
        return NextResponse.json(publications);
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
                link: data.link || null,
            },
        });
        return NextResponse.json(pub, { status: 201 });
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
