import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null, isActive: true },
      orderBy: { order: 'asc' },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
          include: {
            fields: {
              orderBy: { order: 'asc' },
            },
          },
        },
        fields: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { ads: true },
        },
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
