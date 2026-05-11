import { NextResponse } from 'next/server'

// Middleware is disabled - auth is now handled by better-auth client-side
// Use AuthGuard component in layouts instead
export function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
