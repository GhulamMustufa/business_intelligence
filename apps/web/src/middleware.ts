import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

const isPublicRoute = (pathname: string) => {
  return pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/api/');
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_key_for_dev_only');
    await jose.jwtVerify(token, secret);
    return NextResponse.next();
  } catch (error) {
    console.error('Invalid JWT in middleware:', error);
    const loginUrl = new URL('/login', request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('auth_token');
    return response;
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
