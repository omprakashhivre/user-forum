import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth-middleware'


export async function DELETE(req: NextRequest, { params }: any) {
  const user = await getUserFromRequest(req)as any;
  if (!user) return NextResponse.json({ status: 'failed', message: 'Unauthorized' }, { status: 401 })

  const comment = await prisma.comment.findUnique({ where: { id: params.commentId } })
  if (!comment || comment.userId !== user.id)
    return NextResponse.json({ status: 'failed', message: 'Access denied' }, { status: 403 })

  await prisma.comment.delete({ where: { id: params.commentId } })

  return NextResponse.json({ status: 'success', message: 'Comment deleted' })
}
