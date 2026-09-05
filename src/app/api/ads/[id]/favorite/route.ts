import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Please login to save ads' }, { status: 401 });
    }

    const { id: adId } = params;

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_adId: {
          userId: user.id,
          adId,
        },
      },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ favorited: false });
    } else {
      await prisma.favorite.create({
        data: {
          userId: user.id,
          adId,
        },
      });
      return NextResponse.json({ favorited: true });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json({ error: 'Failed to update favorite' }, { status: 500 });
  }
}
