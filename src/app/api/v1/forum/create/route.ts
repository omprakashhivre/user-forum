import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth-middleware'

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req) as any;
  if (!user) return NextResponse.json({ status: 'failed', message: 'Unauthorized' }, { status: 401 })

  const { title, description, tags } = await req.json()
  if (!title || !description)
    return NextResponse.json({ status: 'failed', message: 'Title & Description required' }, { status: 400 })

  const forum = await prisma.forum.create({
    data: {
      title,
      description,
      tags,
      userId: user.id,
    },
  })

  return NextResponse.json({ status: 'success', message: 'Forum created', forum })
}
