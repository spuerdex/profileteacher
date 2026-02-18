import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/themes - List all theme presets (public)
export async function GET() {
    try {
        const themes = await prisma.themePreset.findMany({ orderBy: { id: 'asc' } });
        return NextResponse.json(themes);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch themes' }, { status: 500 });
    }
}

// POST /api/themes - Create theme (admin only)
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const theme = await prisma.themePreset.create({
            data: {
                name: data.name,
                slug,
                primary: data.primary,
                primaryLight: data.primaryLight,
                primaryDark: data.primaryDark,
                accent: data.accent,
                gradient: data.gradient || `linear-gradient(135deg, ${data.primary}, ${data.accent})`,
                isDefault: false,
            },
        });

        return NextResponse.json(theme, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create theme' }, { status: 500 });
    }
}
