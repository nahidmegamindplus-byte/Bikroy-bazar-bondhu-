import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const divisions = await prisma.location.findMany({
      where: { type: 'DIVISION' },
      orderBy: { order: 'asc' },
      include: {
        children: {
          orderBy: { name: 'asc' },
          include: {
            children: {
              orderBy: { name: 'asc' },
            },
          },
        },
      },
    });

    return NextResponse.json({ divisions });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}
