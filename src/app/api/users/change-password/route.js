import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// POST /api/users/change-password
// Teacher changes own password (requires currentPassword)
// Admin resets any teacher's password (requires teacherId, newPassword)
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();

        // Admin resetting a teacher's password
        if (session.user.role === 'admin' && data.teacherId) {
            if (!data.newPassword || data.newPassword.length < 4) {
                return NextResponse.json({ error: 'รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร' }, { status: 400 });
            }

            const user = await prisma.user.findFirst({ where: { teacherId: parseInt(data.teacherId) } });
            if (!user) {
                return NextResponse.json({ error: 'ไม่พบบัญชีผู้ใช้ของอาจารย์คนนี้' }, { status: 404 });
            }

            const hashedPassword = await bcrypt.hash(data.newPassword, 10);
            await prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword },
            });

            return NextResponse.json({ success: true, message: 'รีเซ็ตรหัสผ่านสำเร็จ' });
        }

        // Teacher changing own password
        if (!data.currentPassword || !data.newPassword) {
            return NextResponse.json({ error: 'กรุณากรอกรหัสผ่านปัจจุบันและรหัสผ่านใหม่' }, { status: 400 });
        }

        if (data.newPassword.length < 4) {
            return NextResponse.json({ error: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 4 ตัวอักษร' }, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'ไม่พบบัญชีผู้ใช้' }, { status: 404 });
        }

        const isValid = await bcrypt.compare(data.currentPassword, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(data.newPassword, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        return NextResponse.json({ success: true, message: 'เปลี่ยนรหัสผ่านสำเร็จ' });
    } catch (error) {
        console.error('Change password error:', error);
        return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 });
    }
}
