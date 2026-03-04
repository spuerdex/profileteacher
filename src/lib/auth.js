import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from './prisma';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error('กรุณากรอก Username และ Password');
                }

                const user = await prisma.user.findUnique({
                    where: { username: credentials.username },
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
                    username: user.username,
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
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.sub;
            session.user.role = token.role;
            session.user.teacherId = token.teacherId;
            session.user.username = token.username;
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
