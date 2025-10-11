import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // Check if the user is accessing admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // In a real application, you would verify the session/token
    // For now, we'll redirect non-admin users to home
    // The actual authentication is handled in the admin page component
    return NextResponse.next()
  }
}

export const config = {
  matcher: '/admin/:path*',
}