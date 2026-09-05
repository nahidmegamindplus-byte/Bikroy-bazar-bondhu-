import React, { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import SearchClient from './SearchClient';

export const revalidate = 0;

export default async function SearchPage() {
  const [categories, divisions] = await Promise.all([
    prisma.category.findMany({
      where: { parentId: null, isActive: true },
      orderBy: { order: 'asc' },
      include: {
        children: true,
        fields: true,
      },
    }),
    prisma.location.findMany({
      where: { type: 'DIVISION' },
      orderBy: { order: 'asc' },
      include: {
        children: true,
      },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading marketplace...</div>}>
        <SearchClient categories={categories} divisions={divisions} />
      </Suspense>
    </div>
  );
}
