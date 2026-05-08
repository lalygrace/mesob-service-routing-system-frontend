import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

// 1. Specify protected and public routes
const protectedRoutes = ['/admin']
const publicRoutes = ['/auth/login', '/auth/signup', '/']

// Role-based route restrictions
const roleRestrictedRoutes: Record<string, string[]> = {
  '/admin/users': ['SUPER_ADMIN', 'ADMIN'],
  '/admin/settings': ['SUPER_ADMIN', 'ADMIN'],
  '/admin/audit-logs': ['SUPER_ADMIN'],
}

export default async function proxy(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route))

  // 3. Verify session with backend API and get user data
  let isAuthenticated = false
  let userRole: string | null = null
  
  if (isProtectedRoute) {
    try {
      const cookieHeader = req.headers.get('cookie') || ''
      const response = await fetch(`${API_URL}/api/admin/me`, {
        method: 'GET',
        headers: {
          'cookie': cookieHeader,
        },
        cache: 'no-store',
      })

      if (response.ok) {
        const userData = await response.json()
        isAuthenticated = true
        userRole = userData.role
      }
    } catch (error) {
      console.error('Auth verification failed:', error)
      isAuthenticated = false
    }
  }

  // 4. Redirect to /auth/login if the user is not authenticated on protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', req.nextUrl)
    loginUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(loginUrl)
  }

  // 5. Check role-based access
  if (isAuthenticated && userRole) {
    for (const [route, allowedRoles] of Object.entries(roleRestrictedRoutes)) {
      if (path.startsWith(route) && !allowedRoles.includes(userRole)) {
        // User doesn't have the required role, redirect to admin dashboard
        return NextResponse.redirect(new URL('/admin', req.nextUrl))
      }
    }
  }

  // 6. Redirect to /admin if the user is authenticated on public routes (optional)
  if (
    isPublicRoute &&
    path === '/'
  ) {
    try {
      const cookieHeader = req.headers.get('cookie') || ''
      const response = await fetch(`${API_URL}/api/admin/me`, {
        method: 'GET',
        headers: {
          'cookie': cookieHeader,
        },
        cache: 'no-store',
      })

      if (response.ok) {
        return NextResponse.redirect(new URL('/admin', req.nextUrl))
      }
    } catch (error) {
      // If auth check fails, continue to public route
    }
  }

  return NextResponse.next()
}

// Routes Proxy should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
