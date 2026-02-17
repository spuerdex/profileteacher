import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from './prisma';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('กรุณากรอก Email และ Password');
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    include: { teacher: true },
                });

                if (!user) {
                    throw new Error('ไม่พบบัญชีผู้ใช้');
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) {
                    throw new Error('รหัสผ่านไม่ถูกต้อง');
                }

                return {
                    id: user.id.toString(),
                    email: user.email,
                    role: user.role,
                    teacherId: user.teacherId,
                    name: user.teacher
                        ? `${user.teacher.firstNameTh} ${user.teacher.lastNameTh}`
                        : 'Admin',
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.teacherId = user.teacherId;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.sub;
            session.user.role = token.role;
            session.user.teacherId = token.teacherId;
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};
