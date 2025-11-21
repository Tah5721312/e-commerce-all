import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

// GET all images for a product
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
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const images = await prisma.productImage.findMany({
      where: { productId },
      orderBy: {
        imageOrder: 'asc',
      },
    });

    return NextResponse.json({
      data: images.map((img) => ({
        id: img.id,
        productId: img.productId,
        imageUrl: img.imageUrl,
        imageOrder: img.imageOrder,
        createdAt: img.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching product images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product images' },
      { status: 500 }
    );
  }
}

// POST - Add new image to product
export async function POST(
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
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const body = await request.json();
    const { imageUrl, imageOrder } = body;

    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Get current max order to set default
    const maxOrder = await prisma.productImage.aggregate({
      where: { productId },
      _max: { imageOrder: true },
    });

    const newImage = await prisma.productImage.create({
      data: {
        productId,
        imageUrl: imageUrl.trim(),
        imageOrder: imageOrder !== undefined ? imageOrder : (maxOrder._max.imageOrder ?? -1) + 1,
      },
    });

    return NextResponse.json(
      {
        data: {
          id: newImage.id,
          productId: newImage.productId,
          imageUrl: newImage.imageUrl,
          imageOrder: newImage.imageOrder,
          createdAt: newImage.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product image:', error);
    return NextResponse.json(
      { error: 'Failed to create product image' },
      { status: 500 }
    );
  }
}

