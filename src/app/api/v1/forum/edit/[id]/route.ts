import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth-middleware'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req) as any;
  if (!user) return NextResponse.json({ status: 'failed', message: 'Unauthorized' }, { status: 401 })

  const forum = await prisma.forum.findUnique({ where: { id: params.id } })
  if (!forum || forum.userId !== user.id)
    return NextResponse.json({ status: 'failed', message: 'Access denied' }, { status: 403 })

  const { title, description, tags } = await req.json()
  const updated = await prisma.forum.update({
    where: { id: params.id },
    data: { title, description, tags },
  })

  return NextResponse.json({ status: 'success', message: 'Forum updated', forum: updated })
}
