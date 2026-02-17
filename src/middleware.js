import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // Public routes - no auth needed
    const publicRoutes = ['/', '/login', '/api/auth'];
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

    // Public profile pages (slug routes) - check if it's NOT a dashboard/api route
    const isDashboardRoute = pathname.startsWith('/dashboard');
    const isApiRoute = pathname.startsWith('/api');

    if (!isDashboardRoute && !isApiRoute) {
        return NextResponse.next();
    }

    if (isPublicRoute) {
        return NextResponse.next();
    }

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    // Not logged in - redirect to login
    if (!token && isDashboardRoute) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Admin routes - role check
    if (pathname.startsWith('/dashboard/admin') && token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard/teacher', request.url));
    }

    // Teacher routes - role check
    if (pathname.startsWith('/dashboard/teacher') && token?.role === 'admin') {
        return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/api/:path*'],
};
