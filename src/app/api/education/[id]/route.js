import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// PUT /api/education/[id]
export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.teacherId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const educationId = parseInt(id);

        // Verify ownership
        const existing = await prisma.education.findFirst({
            where: { id: educationId, teacherId: session.user.teacherId },
        });

        if (!existing) {
            return NextResponse.json({ error: 'Education record not found or access denied' }, { status: 404 });
        }

        const data = await request.json();

        const updated = await prisma.education.update({
            where: { id: educationId },
            data: {
                degree: data.degree,
                field: data.field,
                institution: data.institution,
                year: parseInt(data.year),
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update education' }, { status: 500 });
    }
}

// DELETE /api/education/[id]
export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.teacherId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const educationId = parseInt(id);

        // Verify ownership
        const existing = await prisma.education.findFirst({
            where: { id: educationId, teacherId: session.user.teacherId },
        });

        if (!existing) {
            return NextResponse.json({ error: 'Education record not found or access denied' }, { status: 404 });
        }

        await prisma.education.delete({
            where: { id: educationId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete education' }, { status: 500 });
    }
}
