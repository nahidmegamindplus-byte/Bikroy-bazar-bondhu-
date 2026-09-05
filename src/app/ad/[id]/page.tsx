import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AdDetailsClient from './AdDetailsClient';

export const revalidate = 0;

export default async function AdDetailsPage({ params }: { params: { id: string } }) {
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
    notFound();
  }

  // Increment views asynchronously
  await prisma.ad.update({
    where: { id },
    data: { viewsCount: { increment: 1 } },
  });

  // Fetch similar ads
  const similarAds = await prisma.ad.findMany({
    where: {
      categoryId: ad.categoryId,
      id: { not: ad.id },
      status: 'APPROVED',
    },
    take: 3,
    include: {
      images: { where: { isCover: true } },
      division: true,
      district: true,
      area: true,
      category: true,
      user: true,
    },
  });

  return <AdDetailsClient ad={ad} similarAds={similarAds} />;
}
