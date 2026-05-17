import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { signToken, setAuthCookie } from '@/lib/auth'
import { sendWelcomeEmail } from '@/lib/email'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', req.url))
  }

  try {
    // 1. Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
        redirect_uri: process.env.NEXT_PUBLIC_APP_URL + '/api/auth/callback/google',
        grant_type: 'authorization_code',
      }),
    })

    const tokens = await tokenResponse.json()

    if (tokens.error) {
      console.error('[GOOGLE_OAUTH_ERROR] Token exchange failed:', tokens)
      return NextResponse.redirect(new URL('/login?error=auth_failed', req.url))
    }

    // 2. Fetch user profile
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })

    const googleUser = await userResponse.json()

    if (!googleUser.email) {
      return NextResponse.redirect(new URL('/login?error=no_email', req.url))
    }

    // 3. Find or create user in database
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name || 'Google User',
          authProvider: 'google',
          // Password remains null/undefined
        },
      })
      
      // Send welcome email for new Google signups
      sendWelcomeEmail(user.email, user.name).catch(console.error)
    } else {
      // If user exists but was using credentials, we can link them or just update provider
      // For simplicity, we just allow them to login via Google if the email matches
      if (user.authProvider !== 'google') {
          await prisma.user.update({
              where: { id: user.id },
              data: { authProvider: 'google' }
          })
      }
    }

    // 4. Create the redirect response
    const response = NextResponse.redirect(new URL('/dashboard', req.url))

    // 5. Set custom auth cookie directly on the response to ensure it saves
    const token = await signToken({ userId: user.id, email: user.email })
    response.cookies.set('peblo_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response

  } catch (error) {
    console.error('[GOOGLE_OAUTH_ERROR]', error)
    return NextResponse.redirect(new URL('/login?error=internal_error', req.url))
  }
}
