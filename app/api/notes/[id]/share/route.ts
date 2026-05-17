import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { success, fail } from '@/lib/api'
import { getUserFromRequest } from '@/lib/auth'
import { nanoid } from 'nanoid'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserFromRequest(req)
    if (!userId) return fail('Unauthorized', 401)

    const { id } = await params

    const note = await prisma.note.findUnique({
      where: { id, userId },
    })
    if (!note) return fail('Note not found', 404)

    const shareId = nanoid(10)

    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        shareId,
        isPublic: true,
      },
    })

    return success({ shareId: updatedNote.shareId })
  } catch (error) {
    console.error('[SHARE_POST_ERROR]', error)
    return fail('Internal server error', 500)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserFromRequest(req)
    if (!userId) return fail('Unauthorized', 401)

    const { id } = await params

    const note = await prisma.note.findUnique({
      where: { id, userId },
    })
    if (!note) return fail('Note not found', 404)

    await prisma.note.update({
      where: { id },
      data: {
        shareId: null,
        isPublic: false,
      },
    })

    return success({ message: 'Note unshared successfully' })
  } catch (error) {
    console.error('[SHARE_DELETE_ERROR]', error)
    return fail('Internal server error', 500)
  }
}
