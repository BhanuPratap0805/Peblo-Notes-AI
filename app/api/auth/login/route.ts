import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { success, fail } from '@/lib/api'
import { loginSchema } from '@/lib/validations'
import { comparePasswords, signToken, setAuthCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = loginSchema.safeParse(body)
    
    if (!parsed.success) {
      return fail(parsed.error.issues[0].message, 400)
    }
    
    const { email, password } = parsed.data
    
    // Find user
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return fail('Invalid email or password', 401)
    }
    
    // Verify password
    const isValid = await comparePasswords(password, user.password || '')
    if (!isValid) {
      return fail('Invalid email or password', 401)
    }


    
    // Generate JWT and set cookie
    const token = await signToken({ userId: user.id, email: user.email })
    await setAuthCookie(token)
    
    return success({ id: user.id, name: user.name, email: user.email }, 200)
  } catch (error) {
    console.error('[LOGIN_ERROR]', error)
    return fail('Internal server error', 500)
  }
}
