import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/db/prisma';

// GET - Fetch a specific size by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const { id } = await params;
    const sizeId = parseInt(id, 10);

    if (isNaN(sizeId)) {
      return NextResponse.json({ error: 'Invalid size ID' }, { status: 400 });
    }

    const size = await prisma.productSize.findUnique({
      where: { id: sizeId },
    });

    if (!size) {
      return NextResponse.json({ error: 'Size not found' }, { status: 404 });
    }

    return NextResponse.json({
      data: size,
    });
  } catch (error) {
    console.error('Error fetching size:', error);
    return NextResponse.json(
      { error: 'Failed to fetch size' },
      { status: 500 }
    );
  }
}

// PUT - Update a size
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const { id } = await params;
    const sizeId = parseInt(id, 10);

    if (isNaN(sizeId)) {
      return NextResponse.json({ error: 'Invalid size ID' }, { status: 400 });
    }

    const body = await request.json();
    const { name, displayName, sortOrder } = body;

    // Check if size exists
    const existingSize = await prisma.productSize.findUnique({
      where: { id: sizeId },
    });

    if (!existingSize) {
      return NextResponse.json({ error: 'Size not found' }, { status: 404 });
    }

    // If name is being changed, check if new name already exists
    if (name && name !== existingSize.name) {
      const nameExists = await prisma.productSize.findUnique({
        where: { name },
      });

      if (nameExists) {
        return NextResponse.json(
          { error: 'Size with this name already exists' },
          { status: 400 }
        );
      }
    }

    const updatedSize = await prisma.productSize.update({
      where: { id: sizeId },
      data: {
        ...(name && { name }),
        ...(displayName && { displayName }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    return NextResponse.json({
      data: updatedSize,
    });
  } catch (error) {
    console.error('Error updating size:', error);
    return NextResponse.json(
      { error: 'Failed to update size' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a size
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const { id } = await params;
    const sizeId = parseInt(id, 10);

    if (isNaN(sizeId)) {
      return NextResponse.json({ error: 'Invalid size ID' }, { status: 400 });
    }

    // Check if size exists
    const existingSize = await prisma.productSize.findUnique({
      where: { id: sizeId },
      include: {
        variants: true,
      },
    });

    if (!existingSize) {
      return NextResponse.json({ error: 'Size not found' }, { status: 404 });
    }

    // Check if size is used in any variants
    if (existingSize.variants.length > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete size that is used in product variants',
          variantCount: existingSize.variants.length,
        },
        { status: 400 }
      );
    }

    await prisma.productSize.delete({
      where: { id: sizeId },
    });

    return NextResponse.json({
      success: true,
      message: 'Size deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting size:', error);
    return NextResponse.json(
      { error: 'Failed to delete size' },
      { status: 500 }
    );
  }
}

