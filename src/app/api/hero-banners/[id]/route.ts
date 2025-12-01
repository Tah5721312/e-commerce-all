import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db/prisma';

const heroBannerDelegate = (prisma as any).heroBanner;

type Params = {
  params: {
    id: string;
  };
};

export async function PATCH(request: Request, { params }: Params) {
  try {
    const id = Number(params.id);

    if (Number.isNaN(id)) {
      return NextResponse.json({ message: 'Invalid banner id' }, { status: 400 });
    }

    const body = await request.json();

    if (!heroBannerDelegate) {
      throw new Error('HeroBanner model not available on Prisma client');
    }

    const banner = await heroBannerDelegate.update({
      where: { id },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        buttonText: body.buttonText,
        buttonLink: body.buttonLink,
        imageUrl: body.imageUrl,
        textColor: body.textColor,
        sortOrder: typeof body.sortOrder === 'number' ? body.sortOrder : undefined,
      },
    });

    return NextResponse.json({ data: banner });
  } catch (error) {
    console.error('Failed to update hero banner', error);
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Failed to update banner',
      },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const id = Number(params.id);

    if (Number.isNaN(id)) {
      return NextResponse.json({ message: 'Invalid banner id' }, { status: 400 });
    }

    if (!heroBannerDelegate) {
      throw new Error('HeroBanner model not available on Prisma client');
    }

    await heroBannerDelegate.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete hero banner', error);
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Failed to delete banner',
      },
      { status: 400 },
    );
  }
}


