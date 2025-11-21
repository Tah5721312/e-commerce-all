import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

// PUT - Update image
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const { id, imageId } = await params;
    const productId = parseInt(id, 10);
    const imgId = parseInt(imageId, 10);

    if (isNaN(productId) || isNaN(imgId)) {
      return NextResponse.json(
        { error: 'Invalid product ID or image ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { imageUrl, imageOrder } = body;

    // Check if image exists
    const existingImage = await prisma.productImage.findUnique({
      where: { id: imgId },
    });

    if (!existingImage || existingImage.productId !== productId) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const updatedImage = await prisma.productImage.update({
      where: { id: imgId },
      data: {
        ...(imageUrl && { imageUrl: imageUrl.trim() }),
        ...(imageOrder !== undefined && { imageOrder }),
      },
    });

    return NextResponse.json({
      data: {
        id: updatedImage.id,
        productId: updatedImage.productId,
        imageUrl: updatedImage.imageUrl,
        imageOrder: updatedImage.imageOrder,
        createdAt: updatedImage.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error updating product image:', error);
    return NextResponse.json(
      { error: 'Failed to update product image' },
      { status: 500 }
    );
  }
}

// DELETE - Delete image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const { id, imageId } = await params;
    const productId = parseInt(id, 10);
    const imgId = parseInt(imageId, 10);

    if (isNaN(productId) || isNaN(imgId)) {
      return NextResponse.json(
        { error: 'Invalid product ID or image ID' },
        { status: 400 }
      );
    }

    // Check if image exists
    const existingImage = await prisma.productImage.findUnique({
      where: { id: imgId },
    });

    if (!existingImage || existingImage.productId !== productId) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    await prisma.productImage.delete({
      where: { id: imgId },
    });

    return NextResponse.json(
      { message: 'Image deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting product image:', error);
    return NextResponse.json(
      { error: 'Failed to delete product image' },
      { status: 500 }
    );
  }
}

