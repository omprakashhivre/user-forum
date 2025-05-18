import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth-middleware'

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req) as any

    if (!user) {
      return NextResponse.json(
        { status: 'failed', message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const forums = await prisma.forum.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        likes: {
          select: {
            id: true,
            userId: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(
      { status: 'success', data: forums },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching forums:', error)
    return NextResponse.json(
      { status: 'failed', message: 'Failed to fetch forums' },
      { status: 500 }
    )
  }
}
