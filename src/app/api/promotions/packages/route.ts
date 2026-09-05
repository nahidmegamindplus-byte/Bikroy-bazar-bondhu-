import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const packages = await prisma.promotionPackage.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });

    return NextResponse.json({ packages });
  } catch (error) {
    console.error('Error fetching promotion packages:', error);
    return NextResponse.json({ error: 'Failed to fetch promotion packages' }, { status: 500 });
  }
}
