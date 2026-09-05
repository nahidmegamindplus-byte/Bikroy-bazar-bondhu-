import React from 'react';
import { prisma } from '@/lib/prisma';
import PostAdWizard from './PostAdWizard';

export const revalidate = 0;

export default async function PostAdPage() {
  const [categories, divisions] = await Promise.all([
    prisma.category.findMany({
      where: { parentId: null, isActive: true },
      orderBy: { order: 'asc' },
      include: {
        children: {
          include: {
            fields: { orderBy: { order: 'asc' } },
          },
        },
        fields: { orderBy: { order: 'asc' } },
      },
    }),
    prisma.location.findMany({
      where: { type: 'DIVISION' },
      orderBy: { order: 'asc' },
      include: {
        children: {
          include: {
            children: true,
          },
        },
      },
    }),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PostAdWizard categories={categories} divisions={divisions} />
    </div>
  );
}
