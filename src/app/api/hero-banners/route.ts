import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const heroBannerDelegate = (prisma as any).heroBanner;

export async function GET() {
  if (!heroBannerDelegate) {
    return NextResponse.json(
      { data: [], message: 'HeroBanner model not available on Prisma client' },
      { status: 500 },
    );
  }

  const banners = await heroBannerDelegate.findMany({
    orderBy: [
      {
        sortOrder: 'asc',
      },
      {
        createdAt: 'asc',
      },
    ],
  });

  return NextResponse.json({ data: banners });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!heroBannerDelegate) {
      throw new Error('HeroBanner model not available on Prisma client');
    }

    const banner = await heroBannerDelegate.create({
      data: {
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        buttonText: body.buttonText,
        buttonLink: body.buttonLink,
        imageUrl: body.imageUrl,
        textColor: body.textColor ?? '#2B3445',
        sortOrder: typeof body.sortOrder === 'number' ? body.sortOrder : 0,
      },
    });

    return NextResponse.json({ data: banner }, { status: 201 });
  } catch (error) {
    console.error('Failed to create hero banner', error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Failed to create hero banner',
      },
      { status: 400 },
    );
  }
}


