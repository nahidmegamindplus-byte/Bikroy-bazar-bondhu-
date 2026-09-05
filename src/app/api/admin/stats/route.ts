import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'MODERATOR')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const [
      totalUsers,
      totalAds,
      pendingAds,
      approvedAds,
      soldAds,
      openReports,
      payments,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.ad.count(),
      prisma.ad.count({ where: { status: 'PENDING' } }),
      prisma.ad.count({ where: { status: 'APPROVED' } }),
      prisma.ad.count({ where: { status: 'SOLD' } }),
      prisma.report.count({ where: { status: 'PENDING' } }),
      prisma.payment.findMany({
        where: { status: 'PAID' },
        select: { amount: true },
      }),
    ]);

    const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);

    return NextResponse.json({
      totalUsers,
      totalAds,
      pendingAds,
      approvedAds,
      soldAds,
      openReports,
      totalRevenue,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
