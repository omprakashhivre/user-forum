import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = params.id

//   if (isNaN(userId)) {
//     return NextResponse.json(
//       { status: 'failed', message: 'Invalid user ID' },
//       { status: 400 }
//     )
//   }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        forums: true, // Forums created by the user
        likes: {
          include: {
            forum: true, // Include full forum data liked by user
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { status: 'failed', message: 'User not found' },
        { status: 404 }
      )
    }

    // Prepare clean response
    const response = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdForums: user.forums.map(f => f.id),
      likedForumIds: user.likes.map(like => like.forumId),
      likedForums: user.likes.map(like => like.forum),
    }

    return NextResponse.json({ status: 'success', data: response }, { status: 200 })
  } catch (error) {
    console.error('Error fetching user details:', error)
    return NextResponse.json(
      { status: 'failed', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
