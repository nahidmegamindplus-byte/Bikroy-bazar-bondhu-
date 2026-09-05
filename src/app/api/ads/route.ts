import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim();
    const categorySlug = searchParams.get('category');
    const subcategorySlug = searchParams.get('subcategory');
    const divisionSlug = searchParams.get('division');
    const districtSlug = searchParams.get('district');
    const areaSlug = searchParams.get('area');
    const condition = searchParams.get('condition');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const isFeatured = searchParams.get('featured');
    const isUrgent = searchParams.get('urgent');
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'APPROVED',
    };

    if (q) {
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
      ];
    }

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (subcategorySlug) {
      where.subcategory = { slug: subcategorySlug };
    }

    if (divisionSlug) {
      where.division = { slug: divisionSlug };
    }

    if (districtSlug) {
      where.district = { slug: districtSlug };
    }

    if (areaSlug) {
      where.area = { slug: areaSlug };
    }

    if (condition) {
      where.condition = condition;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (isFeatured === 'true') {
      where.isFeatured = true;
    }

    if (isUrgent === 'true') {
      where.isUrgent = true;
    }

    let orderBy: any = [{ isTop: 'desc' }, { createdAt: 'desc' }];
    if (sort === 'price_asc') {
      orderBy = [{ price: 'asc' }];
    } else if (sort === 'price_desc') {
      orderBy = [{ price: 'desc' }];
    } else if (sort === 'views') {
      orderBy = [{ viewsCount: 'desc' }];
    }

    const [total, ads] = await Promise.all([
      prisma.ad.count({ where }),
      prisma.ad.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
          category: {
            select: { id: true, name: true, nameBn: true, slug: true },
          },
          subcategory: {
            select: { id: true, name: true, nameBn: true, slug: true },
          },
          division: {
            select: { id: true, name: true, nameBn: true, slug: true },
          },
          district: {
            select: { id: true, name: true, nameBn: true, slug: true },
          },
          area: {
            select: { id: true, name: true, nameBn: true, slug: true },
          },
          user: {
            select: {
              id: true,
              name: true,
              isVerified: true,
              businessName: true,
              role: true,
            },
          },
          attributes: true,
        },
      }),
    ]);

    return NextResponse.json({
      ads,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching ads:', error);
    return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required to post an ad' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      price,
      isNegotiable,
      condition,
      categoryId,
      subcategoryId,
      divisionId,
      districtId,
      areaId,
      address,
      sellerPhone,
      showPhone,
      images, // array of URL strings
      attributes, // object of { [key]: value }
    } = body;

    if (!title || !description || price === undefined || !categoryId || !sellerPhone) {
      return NextResponse.json({ error: 'Please provide all required fields' }, { status: 400 });
    }

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}-${Date.now()}`;

    // Auto-approve ads for business sellers and admins, otherwise pending moderation
    const status = user.role === 'ADMIN' || user.role === 'BUSINESS_SELLER' ? 'APPROVED' : 'APPROVED'; // Default approved for responsive demo, easily switched to PENDING

    const newAd = await prisma.ad.create({
      data: {
        title,
        slug,
        description,
        price: parseFloat(price),
        isNegotiable: Boolean(isNegotiable),
        condition: condition || 'USED',
        status,
        sellerPhone,
        showPhone: showPhone !== false,
        address: address || null,
        categoryId,
        subcategoryId: subcategoryId || null,
        divisionId: divisionId || null,
        districtId: districtId || null,
        areaId: areaId || null,
        userId: user.id,
      },
    });

    // Add images
    if (Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await prisma.adImage.create({
          data: {
            adId: newAd.id,
            url: images[i],
            isCover: i === 0,
            order: i,
          },
        });
      }
    } else {
      // Fallback placeholder image
      await prisma.adImage.create({
        data: {
          adId: newAd.id,
          url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
          isCover: true,
          order: 0,
        },
      });
    }

    // Add attributes
    if (attributes && typeof attributes === 'object') {
      for (const [key, value] of Object.entries(attributes)) {
        if (value) {
          await prisma.adAttribute.create({
            data: {
              adId: newAd.id,
              fieldKey: key,
              value: String(value),
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true, ad: newAd }, { status: 201 });
  } catch (error) {
    console.error('Error creating ad:', error);
    return NextResponse.json({ error: 'Failed to create ad' }, { status: 500 });
  }
}
