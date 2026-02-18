import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// PUT /api/themes/[id]
export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const data = await request.json();

        const theme = await prisma.themePreset.update({
            where: { id: parseInt(id) },
            data: {
                name: data.name,
                primary: data.primary,
                primaryLight: data.primaryLight,
                primaryDark: data.primaryDark,
                accent: data.accent,
                gradient: data.gradient,
            },
        });

        return NextResponse.json(theme);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update theme' }, { status: 500 });
    }
}

// DELETE /api/themes/[id]
export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Reset teachers using this theme
        await prisma.teacher.updateMany({
            where: { themePresetId: parseInt(id) },
            data: { themePresetId: null },
        });

        await prisma.themePreset.delete({ where: { id: parseInt(id) } });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete theme' }, { status: 500 });
    }
}
