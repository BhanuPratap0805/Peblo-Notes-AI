import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { success, fail } from '@/lib/api'
import { signupSchema } from '@/lib/validations'
import { hashPassword, signToken, setAuthCookie } from '@/lib/auth'
import { randomBytes } from 'crypto'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = signupSchema.safeParse(body)
    
    if (!parsed.success) {
      return fail(parsed.error.issues[0].message, 400)
    }
    
    const { name, email, password } = parsed.data
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return fail('User with this email already exists', 400)
    }
    
    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    })
    
    // Send welcome email (fire and forget)
    sendWelcomeEmail(user.email, user.name).catch(console.error)
    
    // Sign in immediately
    const token = await signToken({ userId: user.id, email: user.email })
    await setAuthCookie(token)
    
    return success({ 
      id: user.id, 
      name: user.name, 
      email: user.email 
    }, 201)
  } catch (error) {
    console.error('[SIGNUP_ERROR]', error)
    return fail('Internal server error', 500)
  }
}
