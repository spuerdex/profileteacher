import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/teachers - List all teachers
export async function GET() {
    try {
        const teachers = await prisma.teacher.findMany({
            include: { themePreset: true },
            orderBy: { firstNameTh: 'asc' },
        });
        return NextResponse.json(teachers);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch teachers' }, { status: 500 });
    }
}

// POST /api/teachers - Create a new teacher (admin only)
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();

        // Generate slug from name
        const slug = data.slug || `${data.firstNameEn || data.firstNameTh}-${data.lastNameEn || data.lastNameTh}`
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');

        // Check if username or email already exists
        if (data.username) {
            const existingUserByUsername = await prisma.user.findUnique({ where: { username: data.username } });
            if (existingUserByUsername) {
                return NextResponse.json({ error: 'ชื่อผู้ใช้นี้มีอยู่แล้ว' }, { status: 400 });
            }
        }

        const userEmail = data.email || `${data.username}@example.com`;
        const existingUserByEmail = await prisma.user.findUnique({ where: { email: userEmail } });
        if (existingUserByEmail) {
            return NextResponse.json({ error: 'อีเมลนี้มีผู้ใช้งานแล้ว' }, { status: 400 });
        }

        const teacher = await prisma.teacher.create({
            data: {
                slug,
                titleTh: data.titleTh || null,
                firstNameTh: data.firstNameTh,
                lastNameTh: data.lastNameTh,
                titleEn: data.titleEn || null,
                firstNameEn: data.firstNameEn || null,
                lastNameEn: data.lastNameEn || null,
                position: data.position || null,
                department: data.department || null,
                email: data.email || null,
                phone: data.phone || null,
                bioTh: data.bioTh || null,
                bioEn: data.bioEn || null,
                themePresetId: data.themePresetId || null,
            },
        });

        // Create User account if username & password provided
        if (data.username && data.password) {
            const bcrypt = await import('bcryptjs');
            const hashedPassword = await bcrypt.hash(data.password, 10);
            await prisma.user.create({
                data: {
                    username: data.username,
                    email: userEmail,
                    password: hashedPassword,
                    role: 'teacher',
                    teacherId: teacher.id,
                },
            });
        }

        return NextResponse.json(teacher, { status: 201 });
    } catch (error) {
        console.error('Create teacher error:', error);
        return NextResponse.json({ error: 'Failed to create teacher' }, { status: 500 });
    }
}
