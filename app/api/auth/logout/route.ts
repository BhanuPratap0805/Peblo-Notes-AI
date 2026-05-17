import { NextRequest } from 'next/server'
import { success, fail } from '@/lib/api'
import { clearAuthCookie } from '@/lib/auth'

export async function POST(_req: NextRequest) {
  try {
    await clearAuthCookie()
    return success({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('[LOGOUT_ERROR]', error)
    return fail('Internal server error', 500)
  }
}
