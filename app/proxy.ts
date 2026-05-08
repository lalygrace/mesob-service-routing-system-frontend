import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// 1. Specify protected and public routes
const protectedRoutes = ['/admin']
const publicRoutes = ['/auth/login', '/auth/signup', '/']

export default async function proxy(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route))

  // 3. Check for session cookie (better-auth uses session cookie)
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('better-auth.session_token')

  // 4. Redirect to /auth/login if the user is not authenticated on protected routes
  if (isProtectedRoute && !sessionCookie) {
    const loginUrl = new URL('/auth/login', req.nextUrl)
    loginUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(loginUrl)
  }

  // 5. Redirect to /admin if the user is authenticated on public routes (optional)
  if (
    isPublicRoute &&
    sessionCookie &&
    path === '/'
  ) {
    return NextResponse.redirect(new URL('/admin', req.nextUrl))
  }

  return NextResponse.next()
}

// Routes Proxy should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
