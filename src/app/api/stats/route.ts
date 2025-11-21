import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    // Get total products
    const totalProducts = await prisma.product.count();

    // Get products by category
    const menProducts = await prisma.product.count({
      where: { category: 'men' },
    });

    const womenProducts = await prisma.product.count({
      where: { category: 'women' },
    });

    // Get average price
    const avgPriceResult = await prisma.product.aggregate({
      _avg: {
        productPrice: true,
      },
    });

    // Get total value (sum of all prices)
    const totalValueResult = await prisma.product.aggregate({
      _sum: {
        productPrice: true,
      },
    });

    // Get average rating
    const avgRatingResult = await prisma.product.aggregate({
      _avg: {
        productRating: true,
      },
    });

    // Get products with images count
    const productsWithImages = await prisma.product.count({
      where: {
        images: {
          some: {},
        },
      },
    });

    return NextResponse.json({
      data: {
        totalProducts,
        menProducts,
        womenProducts,
        averagePrice: avgPriceResult._avg.productPrice
          ? Number(avgPriceResult._avg.productPrice)
          : 0,
        totalValue: totalValueResult._sum.productPrice
          ? Number(totalValueResult._sum.productPrice)
          : 0,
        averageRating: avgRatingResult._avg.productRating
          ? Number(avgRatingResult._avg.productRating)
          : 0,
        productsWithImages,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

