import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'MODERATOR')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        ad: {
          select: { id: true, title: true, price: true, status: true },
        },
        reporter: {
          select: { id: true, name: true, phone: true },
        },
      },
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'MODERATOR')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { reportId, status } = await req.json();

    const updated = await prisma.report.update({
      where: { id: reportId },
      data: { status },
    });

    return NextResponse.json({ success: true, report: updated });
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }
}
