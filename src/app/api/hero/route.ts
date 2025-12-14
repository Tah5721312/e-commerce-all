import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db/prisma';

const REQUIRED_FIELDS = [
  'tagLine',
  'title',
  'highlight',
  'saleText',
  'description',
  'buttonText',
  'buttonLink',
  'imageUrl',
];

function validatePayload(payload: Record<string, unknown>) {
  const missing = REQUIRED_FIELDS.filter(
    (field) => typeof payload[field] !== 'string' || !payload[field],
  );

  if (missing.length) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const heroSlideDelegate = (prisma as any).heroSlide;

export async function GET() {
  if (!heroSlideDelegate) {
    return NextResponse.json(
      { data: [], message: 'HeroSlide model not available on Prisma client' },
      { status: 500 },
    );
  }

  const slides = await heroSlideDelegate.findMany({
    orderBy: [
      {
        sortOrder: 'asc',
      },
      {
        createdAt: 'asc',
      },
    ],
  });

  return NextResponse.json({ data: slides });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    validatePayload(body);

    if (!heroSlideDelegate) {
      throw new Error('HeroSlide model not available on Prisma client');
    }

    const slide = await heroSlideDelegate.create({
      data: {
        tagLine: body.tagLine,
        title: body.title,
        highlight: body.highlight,
        saleText: body.saleText,
        description: body.description,
        buttonText: body.buttonText,
        buttonLink: body.buttonLink,
        imageUrl: body.imageUrl,
        accentColor: body.accentColor ?? '#D23F57',
        sortOrder: typeof body.sortOrder === 'number' ? body.sortOrder : 0,
      },
    });

    return NextResponse.json({ data: slide }, { status: 201 });
  } catch (error) {
    console.error('Failed to create hero slide', error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Failed to create hero slide',
      },
      { status: 400 },
    );
  }
}

