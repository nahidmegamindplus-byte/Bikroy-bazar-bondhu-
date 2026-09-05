import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Please login to report an advertisement' }, { status: 401 });
    }

    const { id: adId } = params;
    const { reason, description } = await req.json();

    if (!reason) {
      return NextResponse.json({ error: 'Reason is required' }, { status: 400 });
    }

    const report = await prisma.report.create({
      data: {
        adId,
        reporterId: user.id,
        reason,
        description: description || null,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error('Error reporting ad:', error);
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }
}
