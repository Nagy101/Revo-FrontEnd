import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the token from cookies
  const token = request.cookies.get('token')?.value;

  // Check if the route is an admin route (and not the auth route itself)
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/auth')) {
    // If no token exists, redirect to login page
    if (!token) {
      const loginUrl = new URL('/admin/auth', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If the user goes to the login page while they already have a token, redirect to admin
  if (request.nextUrl.pathname === '/admin/auth' && token) {
    const adminUrl = new URL('/admin', request.url);
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

// Ensure the middleware only runs for paths under /admin
export const config = {
  matcher: ['/admin/:path*'],
};
