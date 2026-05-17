import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { fail } from '@/lib/api'
import { getUserFromRequest } from '@/lib/auth'
import { aiGenerateSchema } from '@/lib/validations'
import { streamAIResponse } from '@/lib/ai'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserFromRequest(req)
    if (!userId) return new Response('Unauthorized', { status: 401 })

    const { id } = await params

    // Rate limiting (simple in-memory check)
    if (!checkRateLimit(`ai:${userId}`)) {
      return fail('Rate limit exceeded. Try again later.', 429)
    }

    const body = await req.json()
    const parsed = aiGenerateSchema.safeParse(body)
    if (!parsed.success) {
      return fail(parsed.error.issues[0].message, 400)
    }

    const note = await prisma.note.findUnique({
      where: { id, userId },
    })
    if (!note) return new Response('Not found', { status: 404 })

    if (!note.content || note.content.trim().length < 10) {
      return fail('Please add some content to the note before using AI (min 10 characters)', 400)
    }

    // Increment usage count for analytics
    await prisma.note.update({
      where: { id },
      data: { aiUsageCount: { increment: 1 } },
    })

    const stream = await streamAIResponse(parsed.data.type, note.content)

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[AI_GENERATE_ERROR]', msg)
    // In development, surface the actual error so it's easier to debug
    if (process.env.NODE_ENV === 'development') {
      return new Response(JSON.stringify({ data: null, error: msg }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return new Response('Internal server error', { status: 500 })
  }
}
