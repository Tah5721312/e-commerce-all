import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, createProduct } from '@/lib/db/products';

export async function GET(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured', data: [] },
        { status: 503 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category'); // category slug

    const products = await getAllProducts(category || undefined);

    return NextResponse.json({
      data: products,
      meta: {
        pagination: {
          page: 1,
          pageSize: products.length,
          pageCount: 1,
          total: products.length,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', data: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const {
      productTitle,
      productPrice,
      productDiscription,
      productRating,
      category,
      images,
      colors,
    } = body;

    console.log('=== RECEIVED PRODUCT DATA ===');
    console.log('Product Title:', productTitle);
    console.log('Product Price:', productPrice);
    console.log('Category:', category);
    console.log('Images received:', images);
    console.log('Images type:', typeof images);
    console.log('Is array?', Array.isArray(images));
    console.log('Images count:', images?.length || 0);

    // Validation
    if (!productTitle || !productPrice || !productDiscription || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get category by slug or ID
    const { prisma } = await import('@/lib/db/prisma');
    let categoryRecord;
    
    if (typeof category === 'number' || !isNaN(Number(category))) {
      categoryRecord = await prisma.productCategory.findUnique({
        where: { id: Number(category) },
      });
    } else {
      categoryRecord = await prisma.productCategory.findUnique({
        where: { slug: category },
      });
    }

    if (!categoryRecord) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 400 }
      );
    }

    // Ensure images is an array and filter out empty values
    const imagesArray = Array.isArray(images)
      ? images.filter((url: any) => url && typeof url === 'string' && url.trim() !== '')
      : [];

    console.log('Creating product with images:', imagesArray);
    console.log('Images count:', imagesArray.length);

    const product = await createProduct({
      productTitle,
      productPrice: parseFloat(productPrice),
      productDiscription,
      productRating: parseFloat(productRating) || 0,
      categoryId: categoryRecord.id,
      images: imagesArray,
      colors: colors || [],
    });

    console.log('Product created successfully!');
    console.log('Product ID:', product.id);
    console.log('Product images count:', product.productimg?.length || 0);

    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
