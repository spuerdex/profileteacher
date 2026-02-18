import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/education
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.teacherId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const education = await prisma.education.findMany({
            where: { teacherId: session.user.teacherId },
            orderBy: { year: 'desc' },
        });

        return NextResponse.json(education);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch education' }, { status: 500 });
    }
}

// POST /api/education
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.teacherId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();

        // Validate required fields
        if (!data.degree || !data.year) {
            return NextResponse.json({ error: 'Degree and Year are required' }, { status: 400 });
        }

        const education = await prisma.education.create({
            data: {
                teacherId: session.user.teacherId,
                degree: data.degree,
                field: data.field,
                institution: data.institution,
                year: parseInt(data.year),
            },
        });

        return NextResponse.json(education);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create education' }, { status: 500 });
    }
}
