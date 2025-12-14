import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/db/prisma';

// GET - Fetch all sizes
export async function GET(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const sortBy = searchParams.get('sortBy') || 'sortOrder';
    const order = searchParams.get('order') || 'asc';

    const sizes = await prisma.productSize.findMany({
      orderBy: {
        [sortBy]: order as 'asc' | 'desc',
      },
    });

    return NextResponse.json({
      data: sizes,
    });
  } catch (error) {
    console.error('Error fetching sizes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sizes' },
      { status: 500 }
    );
  }
}

// POST - Create a new size
export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { name, displayName, sortOrder } = body;

    if (!name || !displayName) {
      return NextResponse.json(
        { error: 'Name and displayName are required' },
        { status: 400 }
      );
    }

    // Check if size with same name already exists
    const existingSize = await prisma.productSize.findUnique({
      where: { name },
    });

    if (existingSize) {
      return NextResponse.json(
        { error: 'Size with this name already exists' },
        { status: 400 }
      );
    }

    const size = await prisma.productSize.create({
      data: {
        name,
        displayName,
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json({
      data: size,
    });
  } catch (error) {
    console.error('Error creating size:', error);
    return NextResponse.json(
      { error: 'Failed to create size' },
      { status: 500 }
    );
  }
}

