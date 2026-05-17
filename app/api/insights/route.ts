import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { success, fail } from '@/lib/api'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const userId = getUserFromRequest(req)
    if (!userId) return fail('Unauthorized', 401)

    const [notes, totalCount] = await Promise.all([
      prisma.note.findMany({
        where: { userId, isArchived: false },
        select: { id: true, title: true, tags: true, aiUsageCount: true, updatedAt: true, createdAt: true },
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.note.count({ where: { userId, isArchived: false } })
    ])

    // Tag frequency aggregation
    const tagMap = notes.flatMap(n => n.tags).reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const topTags = Object.entries(tagMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }))

    // Weekly activity aggregation (last 7 days)
    const week = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const day = d.toISOString().split('T')[0]
      return { 
        day, 
        count: notes.filter(n => n.updatedAt.toISOString().startsWith(day)).length 
      }
    }).reverse()

    const aiUsageTotal = notes.reduce((sum, n) => sum + n.aiUsageCount, 0)

    return success({
      totalNotes: totalCount,
      recent: notes.slice(0, 5),
      topTags,
      aiUsageTotal,
      weeklyActivity: week
    })
  } catch (error) {
    console.error('[INSIGHTS_GET_ERROR]', error)
    return fail('Internal server error', 500)
  }
}
