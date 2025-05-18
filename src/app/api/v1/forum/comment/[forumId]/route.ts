import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth-middleware'

export async function POST(req: NextRequest, { params }: { params: { forumId: string } }) {
  const user = await getUserFromRequest(req) as any;
  if (!user) return NextResponse.json({ status: 'failed', message: 'Unauthorized' }, { status: 401 })

  const { content } = await req.json()
  if (!content) return NextResponse.json({ status: 'failed', message: 'Empty comment' }, { status: 400 })

  const comment = await prisma.comment.create({
    data: {
      content,
      forumId: params.forumId,
      userId: user.id,
    },
  })

  return NextResponse.json({ status: 'success', message: 'Comment posted', comment })
}
