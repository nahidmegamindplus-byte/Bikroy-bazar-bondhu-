import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const ad = await prisma.ad.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        attributes: true,
        category: true,
        subcategory: true,
        division: true,
        district: true,
        area: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            avatar: true,
            isVerified: true,
            businessName: true,
            businessLogo: true,
            businessDesc: true,
            memberSince: true,
            _count: {
              select: { ads: true, reviewsReceived: true },
            },
          },
        },
      },
    });

    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    // Increment views count asynchronously
    await prisma.ad.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
    });

    // Fetch similar ads in the same category
    const similarAds = await prisma.ad.findMany({
      where: {
        categoryId: ad.categoryId,
        id: { not: ad.id },
        status: 'APPROVED',
      },
      take: 4,
      include: {
        images: { where: { isCover: true } },
        division: true,
        district: true,
      },
    });

    return NextResponse.json({ ad, similarAds });
  } catch (error) {
    console.error('Error fetching ad details:', error);
    return NextResponse.json({ error: 'Failed to fetch ad details' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();

    // If request is simply incrementing phone views count
    if (body.incrementPhone) {
      const updated = await prisma.ad.update({
        where: { id },
        data: { phoneViewsCount: { increment: 1 } },
        select: { phoneViewsCount: true, sellerPhone: true },
      });
      return NextResponse.json({ success: true, sellerPhone: updated.sellerPhone });
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ad = await prisma.ad.findUnique({ where: { id } });
    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    if (ad.userId !== user.id && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updated = await prisma.ad.update({
      where: { id },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.title && { title: body.title }),
        ...(body.price && { price: parseFloat(body.price) }),
        ...(body.description && { description: body.description }),
      },
    });

    return NextResponse.json({ success: true, ad: updated });
  } catch (error) {
    console.error('Error updating ad:', error);
    return NextResponse.json({ error: 'Failed to update ad' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ad = await prisma.ad.findUnique({ where: { id } });
    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    if (ad.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.ad.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting ad:', error);
    return NextResponse.json({ error: 'Failed to delete ad' }, { status: 500 });
  }
}
