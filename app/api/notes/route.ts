import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { success, fail } from '@/lib/api'
import { getUserFromRequest } from '@/lib/auth'
import { noteCreateSchema } from '@/lib/validations'

export async function GET(req: NextRequest) {
  try {
    const userId = getUserFromRequest(req)
    if (!userId) return fail('Unauthorized', 401)

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')
    const tag = searchParams.get('tag')
    const sort = searchParams.get('sort') || 'updatedAt'
    const order = (searchParams.get('order') as 'asc' | 'desc') || 'desc'
    const archived = searchParams.get('archived') === 'true'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      userId,
      isArchived: archived,
    }

    if (tag) {
      where.tags = { has: tag }
    }

    let notes = await prisma.note.findMany({
      where,
      orderBy: { [sort]: order },
    })

    if (search) {
      const searchLower = search.toLowerCase()
      const tagSearch = searchLower.startsWith('#') ? searchLower.slice(1) : searchLower

      notes = notes.filter((note: any) => {
        const titleMatch = note.title?.toLowerCase().includes(searchLower)
        const contentMatch = note.content?.toLowerCase().includes(searchLower)
        const tagMatch = note.tags?.some((t: string) => t.toLowerCase().includes(tagSearch))
        return titleMatch || contentMatch || tagMatch
      })
    }

    return success(notes)
  } catch (error) {
    console.error('[NOTES_GET_ERROR]', error)
    return fail('Internal server error', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserFromRequest(req)
    if (!userId) return fail('Unauthorized', 401)

    const body = await req.json()
    const parsed = noteCreateSchema.safeParse(body)
    if (!parsed.success) {
      return fail(parsed.error.issues[0].message, 400)
    }

    const note = await prisma.note.create({
      data: {
        ...parsed.data,
        userId,
      },
    })

    return success(note, 201)
  } catch (error) {
    console.error('[NOTES_POST_ERROR]', error)
    return fail('Internal server error', 500)
  }
}
