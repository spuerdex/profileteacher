import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    try {
        if (key) {
            const setting = await prisma.systemSettings.findUnique({
                where: { key }
            });
            return NextResponse.json(setting);
        }

        const settings = await prisma.systemSettings.findMany();
        const result = {};
        settings.forEach(s => { result[s.key] = s.value; });
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}
