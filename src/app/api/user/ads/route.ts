import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where: any = { userId: user.id };
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const ads = await prisma.ad.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        images: { orderBy: { order: 'asc' } },
        category: true,
        promotions: {
          where: { status: 'ACTIVE' },
          include: { package: true },
        },
        _count: {
          select: { favorites: true, conversations: true },
        },
      },
    });

    const counts = {
      all: await prisma.ad.count({ where: { userId: user.id } }),
      active: await prisma.ad.count({ where: { userId: user.id, status: 'APPROVED' } }),
      pending: await prisma.ad.count({ where: { userId: user.id, status: 'PENDING' } }),
      sold: await prisma.ad.count({ where: { userId: user.id, status: 'SOLD' } }),
    };

    return NextResponse.json({ ads, counts });
  } catch (error) {
    console.error('Error fetching user ads:', error);
    return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 });
  }
}
