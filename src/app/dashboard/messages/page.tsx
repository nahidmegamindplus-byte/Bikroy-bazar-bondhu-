import React, { Suspense } from 'react';
import MessagesClient from './MessagesClient';

export const revalidate = 0;

export default function MessagesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading messages...</div>}>
        <MessagesClient />
      </Suspense>
    </div>
  );
}
