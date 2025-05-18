import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-middleware';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(req) as any;
    if (!user) {
      return NextResponse.json({ status: 'failed', message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    console.log("Deleting forum ID:", id);

    const forum = await prisma.forum.findUnique({ where: { id } });
    if (!forum || forum.userId !== user.id) {
      return NextResponse.json({ status: 'failed', message: 'Access denied' }, { status: 403 });
    }

    // OPTIONAL: Delete related records first
    // await prisma.comment.deleteMany({ where: { forumId: id } }); // if you have a Comment model
    // await prisma.like.deleteMany({ where: { forumId: id } }); // if you have a Comment model
    await prisma.forum.delete({ where: { id } });

    return NextResponse.json({ status: 'success', message: 'Forum deleted' });

  } catch (error) {
    console.error('Error deleting forum:', error);
    return NextResponse.json({ status: 'failed', message: 'Internal server error' }, { status: 500 });
  }
}
