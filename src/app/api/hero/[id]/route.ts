import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const heroSlideDelegate = (prisma as any).heroSlide;

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);

    if (Number.isNaN(id)) {
      return NextResponse.json({ message: 'Invalid slide id' }, { status: 400 });
    }

    const body = await request.json();

    const slide = await heroSlideDelegate.update({
      where: { id },
      data: {
        tagLine: body.tagLine,
        title: body.title,
        highlight: body.highlight,
        saleText: body.saleText,
        description: body.description,
        buttonText: body.buttonText,
        buttonLink: body.buttonLink,
        imageUrl: body.imageUrl,
        accentColor: body.accentColor,
        sortOrder: typeof body.sortOrder === 'number' ? body.sortOrder : undefined,
      },
    });

    return NextResponse.json({ data: slide });
  } catch (error) {
    console.error('Failed to update hero slide', error);
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Failed to update slide',
      },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);

    if (Number.isNaN(id)) {
      return NextResponse.json({ message: 'Invalid slide id' }, { status: 400 });
    }

    await heroSlideDelegate.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete hero slide', error);
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Failed to delete slide',
      },
      { status: 400 },
    );
  }
}

