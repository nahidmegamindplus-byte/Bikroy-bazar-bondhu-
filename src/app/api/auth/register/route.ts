import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { name, phone, email, password, role, businessName } = await req.json();

    if (!name || !phone || !password) {
      return NextResponse.json({ error: 'Name, phone, and password are required' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { phone },
    });

    if (existing) {
      return NextResponse.json({ error: 'An account with this phone number already exists' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        email: email || null,
        passwordHash,
        role: role === 'BUSINESS_SELLER' ? 'BUSINESS_SELLER' : 'USER',
        businessName: businessName || null,
        isVerified: false,
      },
    });

    const token = signToken({
      userId: user.id,
      role: user.role,
      phone: user.phone,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
        businessName: user.businessName,
      },
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to create user account' }, { status: 500 });
  }
}
