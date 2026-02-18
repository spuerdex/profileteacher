import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/admin/logs
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        // Build activity log from teacher updates (using updatedAt)
        const teachers = await prisma.teacher.findMany({
            orderBy: { updatedAt: 'desc' },
            take: limit,
            skip: (page - 1) * limit,
            include: { user: { select: { email: true } } },
        });

        const total = await prisma.teacher.count();

        const logs = teachers.map(t => ({
            id: t.id,
            teacher: `${t.titleTh || ''} ${t.firstNameTh} ${t.lastNameTh}`.trim(),
            email: t.user?.email || t.email,
            pageViews: t.pageViews,
            updatedAt: t.updatedAt,
            createdAt: t.createdAt,
        }));

        return NextResponse.json({ logs, total, page, limit });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
    }
}
