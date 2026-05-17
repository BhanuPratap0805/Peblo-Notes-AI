import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'fallback-secret-change-in-production'
)

export async function proxy(req: NextRequest) {
  const token = req.cookies.get('peblo_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const res = NextResponse.next()
    // Inject verified userId into header — API routes read from here, never from client body
    res.headers.set('x-user-id', payload.userId as string)
    return res
  } catch {
    // Token expired or invalid — redirect to login
    const res = NextResponse.redirect(new URL('/login', req.url))
    res.cookies.set('peblo_token', '', { maxAge: 0 })
    return res
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/notes/:path*',
    '/api/insights/:path*',
  ],
}
