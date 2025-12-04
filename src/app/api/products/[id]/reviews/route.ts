import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { updateProductRating } from '@/lib/db/products';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reviewDelegate = (prisma as any).productReview;

    const reviews: Array<{
      id: number;
      productId: number;
      author: string;
      rating: number;
      comment: string;
      createdAt: Date;
    }> = await reviewDelegate.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      data: reviews.map((review) => ({
        id: review.id,
        productId: review.productId,
        author: review.author,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews', data: [] },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const { author, rating, comment } = await request.json();

    if (!author || !comment) {
      return NextResponse.json(
        { error: 'Author and comment are required' },
        { status: 400 }
      );
    }

    const numericRating = Math.max(1, Math.min(5, Number(rating) || 5));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reviewDelegate = (prisma as any).productReview;

    const review = await reviewDelegate.create({
      data: {
        productId,
        author: author.toString().slice(0, 100),
        rating: numericRating,
        comment: comment.toString(),
      },
    });

    // تحديث متوسط التقييمات للمنتج
    await updateProductRating(productId);

    return NextResponse.json(
      {
        data: {
          id: review.id,
          productId: review.productId,
          author: review.author,
          rating: Number(review.rating),
          comment: review.comment,
          createdAt: review.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const searchParams = request.nextUrl.searchParams;
    const reviewIdParam = searchParams.get('reviewId');
    const reviewId = reviewIdParam ? parseInt(reviewIdParam, 10) : NaN;

    if (isNaN(reviewId)) {
      return NextResponse.json({ error: 'Invalid review ID' }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reviewDelegate = (prisma as any).productReview;

    await reviewDelegate.delete({
      where: { id: reviewId },
    });

    // تحديث متوسط التقييمات للمنتج بعد الحذف
    await updateProductRating(productId);

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}


