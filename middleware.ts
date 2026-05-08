import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Specify protected and public routes
const protectedRoutes = ['/admin']
const publicRoutes = ['/auth/login', '/auth/signup', '/auth/accept-invitation', '/']

// Role-based route restrictions
const roleRestrictedRoutes: Record<string, string[]> = {
  '/admin/users': ['SUPER_ADMIN', 'ADMIN'],
  '/admin/settings': ['SUPER_ADMIN', 'ADMIN'],
  '/admin/audit-logs': ['SUPER_ADMIN'],
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route))

  console.log(`[Middleware] Path: ${path}, Protected: ${isProtectedRoute}, Public: ${isPublicRoute}`)

  // Verify session with backend API and get user data
  let isAuthenticated = false
  let userRole: string | null = null
  
  if (isProtectedRoute) {
    try {
      const cookieHeader = req.headers.get('cookie') || ''
      console.log(`[Middleware] Checking auth with API: ${API_URL}/api/admin/me`)
      console.log(`[Middleware] Cookie header: ${cookieHeader ? 'present' : 'missing'}`)
      
      const response = await fetch(`${API_URL}/api/admin/me`, {
        method: 'GET',
        headers: {
          'cookie': cookieHeader,
        },
        cache: 'no-store',
      })

      console.log(`[Middleware] API response status: ${response.status}`)
      
      if (response.ok) {
        const userData = await response.json()
        isAuthenticated = true
        userRole = userData.role
        console.log(`[Middleware] User authenticated, role: ${userRole}`)
      } else {
        console.log(`[Middleware] User not authenticated`)
      }
    } catch (error) {
      console.error('[Middleware] Auth verification failed:', error)
      // Backend is not available - deny access to protected routes for security
      console.log('[Middleware] Backend unavailable, denying access to protected route')
      const loginUrl = new URL('/auth/login', req.nextUrl)
      loginUrl.searchParams.set('redirect', path)
      loginUrl.searchParams.set('error', 'backend_unavailable')
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirect to /auth/login if the user is not authenticated on protected routes
  if (isProtectedRoute && !isAuthenticated) {
    console.log(`[Middleware] Redirecting to login`)
    const loginUrl = new URL('/auth/login', req.nextUrl)
    loginUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(loginUrl)
  }

  // Check role-based access
  if (isAuthenticated && userRole) {
    for (const [route, allowedRoles] of Object.entries(roleRestrictedRoutes)) {
      if (path.startsWith(route) && !allowedRoles.includes(userRole)) {
        console.log(`[Middleware] User role ${userRole} not allowed for ${route}`)
        return NextResponse.redirect(new URL('/admin', req.nextUrl))
      }
    }
  }

  // Redirect to /admin if the user is authenticated on public routes
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

  console.log(`[Middleware] Allowing request to proceed`)
  return NextResponse.next()
}

// Configure which routes middleware should run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
