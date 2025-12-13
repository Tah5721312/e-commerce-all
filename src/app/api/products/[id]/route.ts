import { NextRequest, NextResponse } from 'next/server';
import { getProductById } from '@/lib/db/products';
import { prisma } from '@/lib/db/prisma';

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
      company,
      images,
      colors,
    } = body;

    // Check if product exists
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    }) as any;

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Get category by slug or ID
    let categoryId = existingProduct.categoryId;
    if (category) {
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
      
      if (categoryRecord) {
        categoryId = categoryRecord.id;
      }
    }

    // Get company if provided
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let companyId: number | null = existingProduct?.companyId || null;
    if (company !== undefined) {
      if (company === null || company === '') {
        companyId = null;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const companyRecord = await (prisma as any).company?.findUnique({
          where: { id: typeof company === 'number' ? company : parseInt(company) },
        });
        if (companyRecord) {
          companyId = companyRecord.id;
        }
      }
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        productTitle,
        productPrice: parseFloat(productPrice),
        productDiscription,
        productRating: parseFloat(productRating) || 0,
        ...(categoryId && { categoryId }),
        ...(companyId !== undefined && { companyId }),
      },
      include: {
        images: {
          orderBy: {
            imageOrder: 'asc',
          },
        },
        colors: {
          include: {
            variants: true,
          },
        },
      },
    });

    // Update colors and variants if provided
    if (colors && Array.isArray(colors)) {
      // Delete existing colors (variants will be deleted automatically due to cascade)
      await prisma.productColor.deleteMany({
        where: { productId },
      });

      // Create new colors and variants
      for (const colorData of colors) {
        const hasVariants = colorData.variants && colorData.variants.length > 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const colorDataToCreate: any = {
          productId,
          colorName: colorData.colorName,
          colorCode: colorData.colorCode,
        };
        
        // Add quantity only if no variants (for products without sizes)
        if (!hasVariants && colorData.quantity !== undefined) {
          colorDataToCreate.quantity = colorData.quantity || 0;
        }
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const color = await prisma.productColor.create({
          data: colorDataToCreate,
        }) as any;

        // Create variants for this color (if product has sizes)
        if (hasVariants) {
          await prisma.productVariant.createMany({
            data: colorData.variants.map((variant: any) => ({
              productColorId: color.id,
              sizeId: variant.sizeId || variant.size?.id,
              quantity: variant.quantity,
            })),
          });
        }
      }
    }

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

      // Fetch updated product with images and colors
      const productWithImages = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          category: true,
          images: {
            orderBy: {
              imageOrder: 'asc',
            },
          },
          colors: {
            include: {
              variants: {
                include: {
                  size: true,
                },
                orderBy: {
                  size: {
                    sortOrder: 'asc',
                  },
                },
              },
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
          category: {
            id: productWithImages!.category.id,
            name: productWithImages!.category.name,
            slug: productWithImages!.category.slug,
            description: productWithImages!.category.description,
            isActive: productWithImages!.category.isActive,
            sortOrder: productWithImages!.category.sortOrder,
            createdAt: productWithImages!.category.createdAt.toISOString(),
            updatedAt: productWithImages!.category.updatedAt.toISOString(),
          },
          categoryId: productWithImages!.categoryId,
          createdAt: productWithImages!.createdAt.toISOString(),
          updatedAt: productWithImages!.updatedAt.toISOString(),
          productimg: productWithImages!.images.map((img: { id: number; imageUrl: string; imageOrder: number }) => ({
            id: img.id,
            url: img.imageUrl,
            image_order: img.imageOrder,
          })),
          colors: productWithImages!.colors?.map((color: any) => ({
            id: color.id,
            colorName: color.colorName,
            colorCode: color.colorCode,
            variants: color.variants.map((variant: any) => ({
              id: variant.id,
              size: variant.size,
              quantity: variant.quantity,
            })),
          })) || [],
        },
      });
    }

    // Fetch updated product with colors
    const productWithColors = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        images: {
          orderBy: {
            imageOrder: 'asc',
          },
        },
        colors: {
          include: {
            variants: {
              include: {
                size: true,
              },
              orderBy: {
                size: {
                  sortOrder: 'asc',
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      data: {
        id: productWithColors!.id,
        productTitle: productWithColors!.productTitle,
        productPrice: Number(productWithColors!.productPrice),
        productDiscription: productWithColors!.productDiscription,
        productRating: Number(productWithColors!.productRating),
        category: {
          id: productWithColors!.category.id,
          name: productWithColors!.category.name,
          slug: productWithColors!.category.slug,
          description: productWithColors!.category.description,
          isActive: productWithColors!.category.isActive,
          sortOrder: productWithColors!.category.sortOrder,
          createdAt: productWithColors!.category.createdAt.toISOString(),
          updatedAt: productWithColors!.category.updatedAt.toISOString(),
        },
        categoryId: productWithColors!.categoryId,
        createdAt: productWithColors!.createdAt.toISOString(),
        updatedAt: productWithColors!.updatedAt.toISOString(),
        productimg: productWithColors!.images.map((img: { id: number; imageUrl: string; imageOrder: number }) => ({
          id: img.id,
          url: img.imageUrl,
          image_order: img.imageOrder,
        })),
        colors: productWithColors!.colors?.map((color: any) => ({
          id: color.id,
          colorName: color.colorName,
          colorCode: color.colorCode,
          variants: color.variants.map((variant: any) => ({
            id: variant.id,
            size: variant.size,
            quantity: variant.quantity,
          })),
        })) || [],
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
