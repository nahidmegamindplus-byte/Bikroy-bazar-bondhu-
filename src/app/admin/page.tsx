import React from 'react';
import AdminClient from './AdminClient';

export const revalidate = 0;

export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AdminClient />
    </div>
  );
}
