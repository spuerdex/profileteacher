import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/teachers/[id]/stats - Get teacher stats
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const teacherId = parseInt(id);

        const [research, activities, publications, courses, teacher] = await Promise.all([
            prisma.research.count({ where: { teacherId } }),
            prisma.activity.count({ where: { teacherId } }),
            prisma.publication.count({ where: { teacherId } }),
            prisma.course.count({ where: { teacherId } }),
            prisma.teacher.findUnique({ where: { id: teacherId }, select: { pageViews: true } }),
        ]);

        return NextResponse.json({
            research,
            activities,
            publications,
            courses,
            pageViews: teacher?.pageViews || 0,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
