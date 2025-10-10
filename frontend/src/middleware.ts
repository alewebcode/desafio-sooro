import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken');

  if (!token && req.nextUrl.pathname !== '/login') {
    console.log('aqui');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/users/:path*', '/evaluations/:path*'],
};
