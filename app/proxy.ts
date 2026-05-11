import { NextRequest, NextResponse } from 'next/server'

// Backend API URL - typically runs on a different port than frontend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888'

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

  console.log(`[Proxy] Path: ${path}, Protected: ${isProtectedRoute}, Public: ${isPublicRoute}`)
  console.log(`[Proxy] API URL: ${API_URL}`)

  // 3. Verify session with backend API and get user data
  let isAuthenticated = false
  let userRole: string | null = null
  
  if (isProtectedRoute) {
    try {
      const cookieHeader = req.headers.get('cookie') || ''
      console.log(`[Proxy] Checking auth with API: ${API_URL}/api/admin/me`)
      console.log(`[Proxy] Cookie header: ${cookieHeader ? 'present' : 'missing'}`)
      
      const response = await fetch(`${API_URL}/api/admin/me`, {
        method: 'GET',
        headers: {
          'cookie': cookieHeader,
        },
        cache: 'no-store',
      })

      console.log(`[Proxy] API response status: ${response.status}`)
      
      if (response.ok) {
        const userData = await response.json()
        isAuthenticated = true
        userRole = userData.role
        console.log(`[Proxy] User authenticated, role: ${userRole}`)
      } else {
        console.log(`[Proxy] User not authenticated`)
      }
    } catch (error) {
      console.error('[Proxy] Auth verification failed:', error)
      isAuthenticated = false
    }
  }

  // 4. Redirect to /auth/login if the user is not authenticated on protected routes
  if (isProtectedRoute && !isAuthenticated) {
    console.log(`[Proxy] Redirecting to login`)
    const loginUrl = new URL('/auth/login', req.nextUrl)
    loginUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(loginUrl)
  }

  // 5. Check role-based access
  if (isAuthenticated && userRole) {
    for (const [route, allowedRoles] of Object.entries(roleRestrictedRoutes)) {
      if (path.startsWith(route) && !allowedRoles.includes(userRole)) {
        console.log(`[Proxy] User role ${userRole} not allowed for ${route}`)
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

  console.log(`[Proxy] Allowing request to proceed`)
  return NextResponse.next()
}

// Routes Proxy should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
