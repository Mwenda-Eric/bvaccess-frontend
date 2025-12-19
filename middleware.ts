import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function middleware(request: NextRequest) {
  const session = await auth();
  const path = request.nextUrl.pathname;

  // If not authenticated, redirect to login
  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  const userRole = session.user?.role;

  // Check if user is trying to access admin-only pages
  if (path.startsWith('/admins') && userRole !== 'SuperAdmin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Check if user is trying to access admin/superadmin pages as viewer
  if (
    (path.startsWith('/operators') ||
      path.startsWith('/locations') ||
      path.startsWith('/settings')) &&
    userRole === 'Viewer'
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api/auth (NextAuth routes)
     * - login page
     * - static files
     * - images
     */
    '/((?!api/auth|login|_next/static|_next/image|favicon.ico|logo.svg).*)',
  ],
};
