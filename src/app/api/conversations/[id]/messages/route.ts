import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: conversationId } = params;

    const conv = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        ad: {
          select: {
            id: true,
            title: true,
            price: true,
            images: { where: { isCover: true }, take: 1 },
          },
        },
        buyer: { select: { id: true, name: true, avatar: true } },
        seller: { select: { id: true, name: true, avatar: true, businessName: true } },
      },
    });

    if (!conv || (conv.buyerId !== user.id && conv.sellerId !== user.id)) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });

    // Mark unread messages as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: user.id },
        isRead: false,
      },
      data: { isRead: true },
    });

    return NextResponse.json({ conversation: conv, messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: conversationId } = params;
    const { text, imageUrl } = await req.json();

    if (!text && !imageUrl) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    const conv = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conv || (conv.buyerId !== user.id && conv.sellerId !== user.id)) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: user.id,
        text: text || '',
        imageUrl: imageUrl || null,
      },
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
