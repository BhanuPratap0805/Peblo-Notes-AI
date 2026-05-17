import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { success, fail } from '@/lib/api'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const userId = getUserFromRequest(req)
    if (!userId) {
      return fail('Unauthorized', 401)
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, createdAt: true }
    })
    
    if (!user) {
      return fail('User not found', 404)
    }
    
    return success(user)
  } catch (error) {
    console.error('[ME_ERROR]', error)
    return fail('Internal server error', 500)
  }
}
