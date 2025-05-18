import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: any) {
  const { id } = params
  const url = new URL(req.url)
  const detailed = url.searchParams.get('detailed') === 'true'

  try {
    if (detailed) {
      const forum = await prisma.forum.findUnique({
        where: { id },
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

      if (!forum) {
        return NextResponse.json(
          { status: 'failed', message: 'Forum not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(
        { status: 'success', data: forum },
        { status: 200 }
      )
    }

    // Simple version (without relations)
    const forum = await prisma.forum.findUnique({
      where: { id },
    })

    if (!forum) {
      return NextResponse.json(
        { status: 'failed', message: 'Forum not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { status: 'success', data: forum },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching forum:', error)
    return NextResponse.json(
      { status: 'failed', message: 'Error fetching forum' },
      { status: 500 }
    )
  }
}
