import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/teachers/[id] - Get a single teacher
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const teacher = await prisma.teacher.findUnique({
            where: { id: parseInt(id) },
            include: {
                themePreset: true,
                research: { orderBy: { year: 'desc' } },
                activities: { orderBy: { date: 'desc' } },
                publications: { orderBy: { year: 'desc' } },
                courses: true,
                education: { orderBy: { year: 'desc' } },
            },
        });

        if (!teacher) {
            return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
        }

        return NextResponse.json(teacher);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch teacher' }, { status: 500 });
    }
}

// PUT /api/teachers/[id] - Update teacher
export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const teacherId = parseInt(id);

        // Teachers can only edit their own profile
        if (session.user.role === 'teacher' && session.user.teacherId !== teacherId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const data = await request.json();

        // Only update fields that are present in the request
        const allowedFields = [
            'titleTh', 'firstNameTh', 'lastNameTh',
            'titleEn', 'firstNameEn', 'lastNameEn',
            'position', 'department', 'email', 'phone',
            'bioTh', 'bioEn', 'avatar', 'heroImage',
            'themePresetId', 'socialLinks',
        ];

        const updateData = {};
        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                updateData[field] = data[field];
            }
        }

        const teacher = await prisma.teacher.update({
            where: { id: teacherId },
            data: updateData,
        });

        return NextResponse.json(teacher);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update teacher' }, { status: 500 });
    }
}

// DELETE /api/teachers/[id] - Delete teacher (admin only)
export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        await prisma.teacher.delete({ where: { id: parseInt(id) } });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete teacher' }, { status: 500 });
    }
}
