import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { success, fail } from '@/lib/api'
import { getUserFromRequest } from '@/lib/auth'
import { noteUpdateSchema } from '@/lib/validations'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserFromRequest(req)
    if (!userId) return fail('Unauthorized', 401)

    const { id } = await params
    const note = await prisma.note.findUnique({
      where: { id, userId },
    })

    if (!note) return fail('Note not found', 404)

    return success(note)
  } catch (error) {
    console.error('[NOTE_GET_ERROR]', error)
    return fail('Internal server error', 500)
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserFromRequest(req)
    if (!userId) return fail('Unauthorized', 401)

    const { id } = await params
    const body = await req.json()
    const parsed = noteUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return fail(parsed.error.issues[0].message, 400)
    }

    // Ensure note belongs to user
    const existingNote = await prisma.note.findUnique({
      where: { id, userId },
    })
    if (!existingNote) return fail('Note not found', 404)

    const updatedNote = await prisma.note.update({
      where: { id },
      data: parsed.data,
    })

    return success(updatedNote)
  } catch (error) {
    console.error('[NOTE_PATCH_ERROR]', error)
    return fail('Internal server error', 500)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserFromRequest(req)
    if (!userId) return fail('Unauthorized', 401)

    const { id } = await params
    const existingNote = await prisma.note.findUnique({
      where: { id, userId },
    })
    if (!existingNote) return fail('Note not found', 404)

    await prisma.note.delete({
      where: { id },
    })

    return success({ message: 'Note deleted successfully' })
  } catch (error) {
    console.error('[NOTE_DELETE_ERROR]', error)
    return fail('Internal server error', 500)
  }
}
