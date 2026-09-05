import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const adId = searchParams.get('adId');

    // If querying conversation for a specific ad
    if (adId) {
      const conv = await prisma.conversation.findFirst({
        where: {
          adId,
          OR: [{ buyerId: user.id }, { sellerId: user.id }],
        },
        include: {
          ad: {
            select: {
              id: true,
              title: true,
              price: true,
              images: { where: { isCover: true }, take: 1 },
            },
          },
          buyer: {
            select: { id: true, name: true, avatar: true, phone: true },
          },
          seller: {
            select: { id: true, name: true, avatar: true, phone: true, businessName: true, isVerified: true },
          },
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      return NextResponse.json({ conversation: conv });
    }

    // Otherwise list all conversations for the user
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ buyerId: user.id }, { sellerId: user.id }],
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        ad: {
          select: {
            id: true,
            title: true,
            price: true,
            images: { where: { isCover: true }, take: 1 },
          },
        },
        buyer: {
          select: { id: true, name: true, avatar: true, phone: true },
        },
        seller: {
          select: { id: true, name: true, avatar: true, phone: true, businessName: true, isVerified: true },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { adId, message } = await req.json();
    if (!adId) {
      return NextResponse.json({ error: 'Ad ID is required' }, { status: 400 });
    }

    const ad = await prisma.ad.findUnique({
      where: { id: adId },
      include: {
        user: {
          select: { id: true, name: true, businessName: true },
        },
      },
    });

    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    // If the logged-in user is the owner of the ad
    if (ad.userId === user.id) {
      // Find existing conversations for this ad
      const existingConvs = await prisma.conversation.findFirst({
        where: { adId: ad.id },
        include: {
          ad: true,
          buyer: true,
          seller: true,
          messages: { orderBy: { createdAt: 'asc' } },
        },
      });

      return NextResponse.json({
        isOwner: true,
        conversation: existingConvs,
        message: 'This is your own advertisement.',
      });
    }

    // Check if conversation already exists between this buyer and seller for this ad
    let conv = await prisma.conversation.findFirst({
      where: {
        adId,
        buyerId: user.id,
        sellerId: ad.userId,
      },
      include: {
        ad: {
          select: {
            id: true,
            title: true,
            price: true,
            images: { where: { isCover: true }, take: 1 },
          },
        },
        buyer: { select: { id: true, name: true, avatar: true, phone: true } },
        seller: { select: { id: true, name: true, avatar: true, phone: true, businessName: true, isVerified: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!conv) {
      const created = await prisma.conversation.create({
        data: {
          adId,
          buyerId: user.id,
          sellerId: ad.userId,
        },
      });

      conv = await prisma.conversation.findUnique({
        where: { id: created.id },
        include: {
          ad: {
            select: {
              id: true,
              title: true,
              price: true,
              images: { where: { isCover: true }, take: 1 },
            },
          },
          buyer: { select: { id: true, name: true, avatar: true, phone: true } },
          seller: { select: { id: true, name: true, avatar: true, phone: true, businessName: true, isVerified: true } },
          messages: { orderBy: { createdAt: 'asc' } },
        },
      });
    }

    let newMsg = null;
    if (message && message.trim() && conv) {
      newMsg = await prisma.message.create({
        data: {
          conversationId: conv.id,
          senderId: user.id,
          text: message.trim(),
        },
      });

      await prisma.conversation.update({
        where: { id: conv.id },
        data: { updatedAt: new Date() },
      });

      // Notify seller
      await prisma.notification.create({
        data: {
          userId: ad.userId,
          type: 'MESSAGE',
          title: `New message on "${ad.title.slice(0, 30)}..."`,
          message: `${user.name}: ${message.trim().slice(0, 50)}`,
          link: `/dashboard/messages?conv=${conv.id}`,
        },
      });
    }

    // Fetch updated messages list
    const updatedMessages = await prisma.message.findMany({
      where: { conversationId: conv!.id },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({
      success: true,
      conversation: { ...conv, messages: updatedMessages },
      message: newMsg,
    });
  } catch (error) {
    console.error('Error in conversation handler:', error);
    return NextResponse.json({ error: 'Failed to process conversation' }, { status: 500 });
  }
}
