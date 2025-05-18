import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth-middleware'

export async function POST(req: NextRequest, { params }: { params: { forumId: string } }) {
  const user = await getUserFromRequest(req) as any
  if (!user)
    return NextResponse.json({ status: 'failed', message: 'Unauthorized' }, { status: 401 })

  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        forumId: params.forumId,
        userId: user.id,
      },
    })

    if (existingLike) {
      // If already liked, unlike it
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      })

      return NextResponse.json({ status: 'success', message: 'Unliked' })
    } else {
      // If not liked yet, like it
      await prisma.like.create({
        data: {
          forumId: params.forumId,
          userId: user.id,
        },
      })

      return NextResponse.json({ status: 'success', message: 'Liked' })
    }
  } catch (error) {
    console.error('Toggle like error:', error)
    return NextResponse.json(
      { status: 'failed', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
