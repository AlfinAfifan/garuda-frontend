import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { extractUserRole, getDefaultAuthorizedRoute, isProtectedRoute, isRoleAllowedForRoute } from './src/lib/auth/role-access';

const AUTH_ROUTES = new Set(['/login', '/register']);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthRoute = AUTH_ROUTES.has(pathname);

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const tokenRecord = token && typeof token === 'object' ? (token as Record<string, unknown>) : {};
  const tokenUser = tokenRecord.user && typeof tokenRecord.user === 'object' ? (tokenRecord.user as Record<string, unknown>) : {};
  const currentRole = extractUserRole({
    ...tokenRecord,
    ...tokenUser,
  });

  if (isAuthRoute) {
    if (!token) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL(getDefaultAuthorizedRoute(currentRole), request.url));
  }

  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!isRoleAllowedForRoute(pathname, currentRole)) {
    return NextResponse.redirect(new URL(getDefaultAuthorizedRoute(currentRole), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico|images|.*\\..*).*)'],
};
