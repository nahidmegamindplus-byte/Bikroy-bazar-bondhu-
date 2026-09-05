import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'MODERATOR')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'PENDING';

    const where: any = {};
    if (status !== 'ALL') {
      where.status = status;
    }

    const ads = await prisma.ad.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        images: true,
        category: true,
        division: true,
        district: true,
        user: { select: { id: true, name: true, phone: true, email: true, isVerified: true } },
      },
    });

    return NextResponse.json({ ads });
  } catch (error) {
    console.error('Error in admin ads:', error);
    return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'MODERATOR')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { adId, status, rejectionReason } = await req.json();
    if (!adId || !status) {
      return NextResponse.json({ error: 'Missing adId or status' }, { status: 400 });
    }

    const updated = await prisma.ad.update({
      where: { id: adId },
      data: {
        status,
        rejectionReason: rejectionReason || null,
      },
    });

    // Notify user
    await prisma.notification.create({
      data: {
        userId: updated.userId,
        type: 'AD_STATUS',
        title: status === 'APPROVED' ? 'Ad Approved!' : 'Ad Action Required',
        message:
          status === 'APPROVED'
            ? `Your ad "${updated.title}" is now published and live on the marketplace.`
            : `Your ad "${updated.title}" was not approved. Reason: ${rejectionReason || 'Violates marketplace guidelines.'}`,
        link: `/ad/${updated.id}`,
      },
    });

    return NextResponse.json({ success: true, ad: updated });
  } catch (error) {
    console.error('Error updating ad status:', error);
    return NextResponse.json({ error: 'Failed to update ad status' }, { status: 500 });
  }
}
