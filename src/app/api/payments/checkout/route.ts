import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { adId, packageId, method, accountNo } = await req.json();

    if (!adId || !packageId || !method) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const [ad, pkg] = await Promise.all([
      prisma.ad.findUnique({ where: { id: adId } }),
      prisma.promotionPackage.findUnique({ where: { id: packageId } }),
    ]);

    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    if (!pkg) {
      return NextResponse.json({ error: 'Promotion package not found' }, { status: 404 });
    }

    // Generate unique transaction ID (e.g. BZ-BK783921)
    const prefix = method.substring(0, 2).toUpperCase();
    const randomHex = Math.floor(100000 + Math.random() * 900000);
    const transactionId = `TXN-${prefix}-${randomHex}`;

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + pkg.durationDays * 24 * 60 * 60 * 1000);

    // Create Promotion record
    const promotion = await prisma.promotion.create({
      data: {
        adId: ad.id,
        packageId: pkg.id,
        userId: user.id,
        startDate,
        endDate,
        status: 'ACTIVE',
      },
    });

    // Create Payment record
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        adId: ad.id,
        promotionId: promotion.id,
        transactionId,
        method: method.toUpperCase(),
        amount: pkg.price,
        status: 'PAID',
        gatewayRef: accountNo ? `ACC-${accountNo.slice(-4)}` : 'AUTO-VERIFIED',
      },
    });

    // Activate promotion badges on Ad
    const adUpdateData: any = {};
    if (pkg.type === 'FEATURED_AD') adUpdateData.isFeatured = true;
    if (pkg.type === 'TOP_AD') adUpdateData.isTop = true;
    if (pkg.type === 'URGENT_BADGE') adUpdateData.isUrgent = true;
    if (pkg.type === 'BUMP_UP') adUpdateData.createdAt = new Date(); // resets timestamp to bump up

    await prisma.ad.update({
      where: { id: ad.id },
      data: adUpdateData,
    });

    // Create confirmation notification for user
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'PAYMENT',
        title: 'Promotion Activated!',
        message: `Your ad "${ad.title}" has been boosted with ${pkg.name}. Transaction ID: ${transactionId}`,
        link: `/ad/${ad.id}`,
      },
    });

    return NextResponse.json({
      success: true,
      transactionId,
      amount: pkg.price,
      packageName: pkg.name,
      payment,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 });
  }
}
