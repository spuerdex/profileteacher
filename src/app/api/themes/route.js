import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/themes - List all theme presets
export async function GET() {
    try {
        const themes = await prisma.themePreset.findMany({
            orderBy: { id: 'asc' },
        });
        return NextResponse.json(themes);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch themes' }, { status: 500 });
    }
}
