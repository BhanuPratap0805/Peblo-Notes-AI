import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { success, fail } from '@/lib/api'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ shareId: string }> }) {
  try {
    const { shareId } = await params

    const note = await prisma.note.findUnique({
      where: { shareId, isPublic: true },
      select: {
        title: true,
        content: true,
        tags: true,
        aiSummary: true,
        aiItems: true,
        aiTitle: true,
        updatedAt: true,
        user: {
          select: { name: true }
        }
      }
    })

    if (!note) return fail('Note not found or private', 404)

    return success(note)
  } catch (error) {
    console.error('[SHARED_GET_ERROR]', error)
    return fail('Internal server error', 500)
  }
}
