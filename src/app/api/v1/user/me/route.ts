// file: /app/api/v1/user/me/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth-middleware'

export async function GET(req: NextRequest) {
    try {
        const userDetails = await getUserFromRequest(req) as any

        if (!userDetails) {
            return NextResponse.json({ status: 'failed', message: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: userDetails.id },
            include: {
                forums: {
                    orderBy: { createdAt: 'desc' },
                    include : {
                        user: true
                    }
                },
                likes: {
                    include: {
                        forum: true,
                    },
                },
                comments: {
                    include: {
                        forum: true,
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });


        if (!user) {
            return NextResponse.json({ status: 'failed', message: 'User not found' }, { status: 404 })
        }

        return NextResponse.json(
            {
                status: 'success',
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    createdForums: user.forums,
                    likedForums: user.likes.map((like) => like.forum),
                    comments: user.comments,
                },
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error fetching user details:', error)
        return NextResponse.json(
            { status: 'failed', message: 'Something went wrong' },
            { status: 500 }
        )
    }
}
