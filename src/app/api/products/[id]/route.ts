import { NextRequest, NextResponse } from 'next/server';
import { getProductById } from '@/lib/db/products';
import { prisma } from '@/lib/db/prisma';
import type { ProductCategory } from '@/types/product';

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

    const product = await getProductById(productId);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

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
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const body = await request.json();
    const {
      productTitle,
      productPrice,
      productDiscription,
      productRating,
      category,
      images,
    } = body;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        productTitle,
        productPrice: parseFloat(productPrice),
        productDiscription,
        productRating: parseFloat(productRating) || 0,
        category: category as ProductCategory,
      },
      include: {
        images: {
          orderBy: {
            imageOrder: 'asc',
          },
        },
      },
    });

    // Update images if provided
    if (images && Array.isArray(images)) {
      console.log('Updating images for product:', productId, 'Images:', images);
      
      // Delete existing images
      await prisma.productImage.deleteMany({
        where: { productId },
      });

      // Filter out empty image URLs
      const validImages = images.filter(
        (url: string) => url && url.trim() !== ''
      );

      console.log('Valid images to create:', validImages);

      // Create new images
      if (validImages.length > 0) {
        await prisma.productImage.createMany({
          data: validImages.map((url: string, index: number) => ({
            productId,
            imageUrl: url.trim(),
            imageOrder: index,
          })),
        });
        console.log('Images created successfully');
      } else {
        console.log('No valid images to create');
      }

      // Fetch updated product with images
      const productWithImages = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          images: {
            orderBy: {
              imageOrder: 'asc',
            },
          },
        },
      });

      return NextResponse.json({
        data: {
          id: productWithImages!.id,
          productTitle: productWithImages!.productTitle,
          productPrice: Number(productWithImages!.productPrice),
          productDiscription: productWithImages!.productDiscription,
          productRating: Number(productWithImages!.productRating),
          category: productWithImages!.category,
          createdAt: productWithImages!.createdAt.toISOString(),
          updatedAt: productWithImages!.updatedAt.toISOString(),
          productimg: productWithImages!.images.map((img: { id: number; imageUrl: string; imageOrder: number }) => ({
            id: img.id,
            url: img.imageUrl,
            image_order: img.imageOrder,
          })),
        },
      });
    }

    return NextResponse.json({
      data: {
        id: updatedProduct.id,
        productTitle: updatedProduct.productTitle,
        productPrice: Number(updatedProduct.productPrice),
        productDiscription: updatedProduct.productDiscription,
        productRating: Number(updatedProduct.productRating),
        category: updatedProduct.category,
        createdAt: updatedProduct.createdAt.toISOString(),
        updatedAt: updatedProduct.updatedAt.toISOString(),
        productimg: updatedProduct.images.map((img: { id: number; imageUrl: string; imageOrder: number }) => ({
          id: img.id,
          url: img.imageUrl,
          image_order: img.imageOrder,
        })),
      },
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

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
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Delete product (images will be deleted automatically due to cascade)
    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
