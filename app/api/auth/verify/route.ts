import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { signToken, setAuthCookie } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true }
    })

    if (!verificationToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
    }

    if (verificationToken.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Token expired' }, { status: 400 })
    }

    // Mark user as verified
    await prisma.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: new Date() }
    })

    // Delete the token
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id }
    })

    // Generate JWT and set cookie so they are logged in automatically
    const authToken = await signToken({ userId: verificationToken.user.id, email: verificationToken.user.email })
    await setAuthCookie(authToken)

    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', req.url))
  } catch (error) {
    console.error('[VERIFY_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
