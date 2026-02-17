import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/admin/stats
export async function GET() {
    try {
        const [totalTeachers, totalResearch, totalActivities, viewsResult] = await Promise.all([
            prisma.teacher.count(),
            prisma.research.count(),
            prisma.activity.count(),
            prisma.teacher.aggregate({ _sum: { pageViews: true } }),
        ]);

        return NextResponse.json({
            totalTeachers,
            totalResearch,
            totalActivities,
            totalViews: viewsResult._sum.pageViews || 0,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
