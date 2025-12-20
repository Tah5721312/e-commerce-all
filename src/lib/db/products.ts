import { prisma } from './prisma';

import type { Product } from '@/types/product';

export async function getAllProducts(
  categorySlug?: string,
  includeOutOfStock: boolean = false
): Promise<Product[]> {
  const where: { categoryId?: number } = {};

  // Support filtering by either category slug or name
  if (categorySlug) {
    let category = await prisma.productCategory.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      // Try by exact name (unique)
      category = await prisma.productCategory.findUnique({
        where: { name: categorySlug },
      });
    }

    if (!category) {
      // Try case-insensitive match on name
      category = await prisma.productCategory.findFirst({
        where: { name: { equals: categorySlug, mode: 'insensitive' } },
      });
    }

    if (category) {
      where.categoryId = category.id;
    }
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
      company: true,
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
      reviews: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Filter products based on available quantity (only if includeOutOfStock is false)
  const filteredProducts = includeOutOfStock
    ? products
    : products.filter((product) => {
        // If product has colors
        if (product.colors && product.colors.length > 0) {
          // Check if any color has variants (sizes)
          const hasVariants = product.colors.some(
            (color) => color.variants && color.variants.length > 0
          );

          if (hasVariants) {
            // Product has colors and sizes - check variants quantity
            const totalVariantQuantity = product.colors.reduce((sum, color) => {
              const variantSum = color.variants.reduce(
                (vSum, variant) => vSum + variant.quantity,
                0
              );
              return sum + variantSum;
            }, 0);
            return totalVariantQuantity > 0;
          } else {
            // Product has colors but no sizes - check colors quantity
            const totalColorQuantity = product.colors.reduce(
              (sum, color) => sum + color.quantity,
              0
            );
            return totalColorQuantity > 0;
          }
        } else {
          // Product has no colors - check product quantity
          return product.quantity > 0;
        }
      });

  return filteredProducts.map((product) => ({
    id: product.id,
    productTitle: product.productTitle,
    productPrice: Number(product.productPrice),
    productDiscription: product.productDiscription,
    productRating: Number(product.productRating),
    category: {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
      description: product.category.description,
      isActive: product.category.isActive,
      sortOrder: product.category.sortOrder,
      createdAt: product.category.createdAt.toISOString(),
      updatedAt: product.category.updatedAt.toISOString(),
    },
    categoryId: product.categoryId,
    companyId: product.companyId,
    company: product.company
      ? {
          id: product.company.id,
          name: product.company.name,
          slug: product.company.slug,
          description: product.company.description,
          email: product.company.email,
          phone: product.company.phone,
          address: product.company.address,
          website: product.company.website,
          isActive: product.company.isActive,
          createdAt: product.company.createdAt.toISOString(),
          updatedAt: product.company.updatedAt.toISOString(),
        }
      : null,
    quantity: product.quantity || 0, // For products without colors or sizes
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    productimg: product.images.map((img) => {
      let imageUrl = img.imageUrl;
      // If it's not an external URL, ensure it starts with /
      if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
        if (!imageUrl.startsWith('/')) {
          imageUrl = `/${imageUrl}`;
        }
      }
      return {
        id: img.id,
        url: imageUrl,
        image_order: img.imageOrder,
      };
    }),
    colors:
      product.colors?.map((color) => ({
        id: color.id,
        quantity: color.quantity || 0,
        colorName: color.colorName,
        colorCode: color.colorCode,
        variants: color.variants
          .filter((variant) => variant.size !== null)
          .map((variant) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const size = variant.size!;
            return {
              id: variant.id,
              size: {
                id: size.id,
                name: size.name,
                displayName: size.displayName,
                sortOrder: size.sortOrder,
                createdAt: size.createdAt.toISOString(),
                updatedAt: size.updatedAt.toISOString(),
              },
              sizeId: variant.sizeId,
              quantity: variant.quantity,
            };
          }),
      })) || [],
    reviews:
      product.reviews?.map((review) => ({
        id: review.id,
        productId: review.productId,
        author: review.author,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt.toISOString(),
      })) || [],
  }));
}

export async function getProductById(id: number): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      company: true,
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
      reviews: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  return {
    id: product.id,
    productTitle: product.productTitle,
    productPrice: Number(product.productPrice),
    productDiscription: product.productDiscription,
    productRating: Number(product.productRating),
    category: {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
      description: product.category.description,
      isActive: product.category.isActive,
      sortOrder: product.category.sortOrder,
      createdAt: product.category.createdAt.toISOString(),
      updatedAt: product.category.updatedAt.toISOString(),
    },
    categoryId: product.categoryId,
    companyId: product.companyId,
    company: product.company
      ? {
          id: product.company.id,
          name: product.company.name,
          slug: product.company.slug,
          description: product.company.description,
          email: product.company.email,
          phone: product.company.phone,
          address: product.company.address,
          website: product.company.website,
          isActive: product.company.isActive,
          createdAt: product.company.createdAt.toISOString(),
          updatedAt: product.company.updatedAt.toISOString(),
        }
      : null,
    quantity: product.quantity || 0, // For products without colors or sizes
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    productimg: product.images.map((img) => {
      let imageUrl = img.imageUrl;
      // If it's not an external URL, ensure it starts with /
      if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
        if (!imageUrl.startsWith('/')) {
          imageUrl = `/${imageUrl}`;
        }
      }
      return {
        id: img.id,
        url: imageUrl,
        image_order: img.imageOrder,
      };
    }),
    colors:
      product.colors?.map((color) => ({
        id: color.id,
        colorName: color.colorName,
        colorCode: color.colorCode,
        quantity: color.quantity || 0,
        variants: color.variants
          .filter((variant) => variant.size !== null)
          .map((variant) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const size = variant.size!;
            return {
              id: variant.id,
              size: {
                id: size.id,
                name: size.name,
                displayName: size.displayName,
                sortOrder: size.sortOrder,
                createdAt: size.createdAt.toISOString(),
                updatedAt: size.updatedAt.toISOString(),
              },
              sizeId: variant.sizeId,
              quantity: variant.quantity,
            };
          }),
      })) || [],
    reviews:
      product.reviews?.map((review) => ({
        id: review.id,
        productId: review.productId,
        author: review.author,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt.toISOString(),
      })) || [],
  };
}

/**
 * حساب وتحديث متوسط التقييمات للمنتج
 * @param productId - معرف المنتج
 */
export async function updateProductRating(productId: number): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reviewDelegate = (prisma as any).productReview;

  if (!reviewDelegate) {
    console.warn('ProductReview model not found');
    return;
  }

  // جلب جميع التقييمات للمنتج
  const reviews = await reviewDelegate.findMany({
    where: { productId },
    select: { rating: true },
  });

  // حساب المتوسط
  let averageRating = 0;
  if (reviews.length > 0) {
    const sum = reviews.reduce(
      (acc: number, review: { rating: number }) => acc + review.rating,
      0
    );
    averageRating = sum / reviews.length;
    // تقريب إلى رقمين عشريين
    averageRating = Math.round(averageRating * 100) / 100;
  }

  // تحديث productRating في جدول المنتج
  await prisma.product.update({
    where: { id: productId },
    data: {
      productRating: averageRating,
    },
  });
}

export async function createProduct(product: {
  productTitle: string;
  productPrice: number;
  productDiscription: string;
  productRating: number;
  categoryId: number;
  companyId?: number | null;
  quantity?: number; // For products without colors or sizes
  images: string[];
  colors?: Array<{
    colorName: string;
    colorCode: string;
    quantity?: number; // For products without sizes
    variants: Array<{
      sizeId: number;
      quantity: number;
    }>;
  }>;
}): Promise<Product> {
  console.log('createProduct called with:', {
    productTitle: product.productTitle,
    imagesCount: product.images?.length || 0,
    images: product.images,
  });

  // Filter out empty image URLs
  const validImages = (product.images || []).filter(
    (url) => url && url.trim() !== ''
  );

  console.log('Valid images to create:', validImages);
  console.log('Valid images count:', validImages.length);

  // Create product first
  const newProduct = await prisma.product.create({
    data: {
      productTitle: product.productTitle,
      productPrice: product.productPrice,
      productDiscription: product.productDiscription,
      productRating: product.productRating,
      categoryId: product.categoryId,
      companyId: product.companyId || null,
      quantity:
        !product.colors || product.colors.length === 0
          ? product.quantity || 0
          : 0, // Only set quantity if no colors
    },
  });

  console.log('Product created with ID:', newProduct.id);

  // Then create images separately if there are any
  if (validImages.length > 0) {
    console.log('Creating images for product:', newProduct.id);
    const createdImages = await prisma.productImage.createMany({
      data: validImages.map((url, index) => {
        const trimmedUrl = url.trim();
        console.log(`Creating image ${index}:`, trimmedUrl);
        return {
          productId: newProduct.id,
          imageUrl: trimmedUrl,
          imageOrder: index,
        };
      }),
    });
    console.log('Images created:', createdImages.count);
  } else {
    console.log('No images to create');
  }

  // Create colors and variants if provided
  if (product.colors && product.colors.length > 0) {
    console.log('Creating colors for product:', newProduct.id);
    for (const colorData of product.colors) {
      const hasVariants = colorData.variants && colorData.variants.length > 0;
      const color = await prisma.productColor.create({
        data: {
          productId: newProduct.id,
          colorName: colorData.colorName,
          colorCode: colorData.colorCode,
          quantity: hasVariants ? 0 : colorData.quantity || 0, // Set quantity only if no variants
        },
      });

      // Create variants for this color
      if (colorData.variants && colorData.variants.length > 0) {
        await prisma.productVariant.createMany({
          data: colorData.variants.map((variant) => ({
            productColorId: color.id,
            sizeId: variant.sizeId,
            quantity: variant.quantity,
          })),
        });
      }
    }
  }

  // Fetch product with images and colors
  const productWithImages = await prisma.product.findUnique({
    where: { id: newProduct.id },
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

  if (!productWithImages) {
    throw new Error('Failed to fetch product after creation');
  }

  console.log('Product created successfully!');
  console.log('Product ID:', productWithImages.id);
  console.log('Images created:', productWithImages.images.length);
  console.log(
    'Image details:',
    productWithImages.images.map((img) => ({
      id: img.id,
      url: img.imageUrl,
      order: img.imageOrder,
    }))
  );

  return {
    id: productWithImages.id,
    productTitle: productWithImages.productTitle,
    productPrice: Number(productWithImages.productPrice),
    productDiscription: productWithImages.productDiscription,
    productRating: Number(productWithImages.productRating),
    category: {
      id: productWithImages.category.id,
      name: productWithImages.category.name,
      slug: productWithImages.category.slug,
      description: productWithImages.category.description,
      isActive: productWithImages.category.isActive,
      sortOrder: productWithImages.category.sortOrder,
      createdAt: productWithImages.category.createdAt.toISOString(),
      updatedAt: productWithImages.category.updatedAt.toISOString(),
    },
    categoryId: productWithImages.categoryId,
    createdAt: productWithImages.createdAt.toISOString(),
    updatedAt: productWithImages.updatedAt.toISOString(),
    productimg: productWithImages.images.map((img) => {
      let imageUrl = img.imageUrl;
      // If it's not an external URL, ensure it starts with /
      if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
        if (!imageUrl.startsWith('/')) {
          imageUrl = `/${imageUrl}`;
        }
      }
      return {
        id: img.id,
        url: imageUrl,
        image_order: img.imageOrder,
      };
    }),
    colors:
      productWithImages.colors?.map((color) => ({
        id: color.id,
        colorName: color.colorName,
        colorCode: color.colorCode,
        variants: color.variants
          .filter((variant) => variant.size !== null)
          .map((variant) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const size = variant.size!;
            return {
              id: variant.id,
              size: {
                id: size.id,
                name: size.name,
                displayName: size.displayName,
                sortOrder: size.sortOrder,
                createdAt: size.createdAt.toISOString(),
                updatedAt: size.updatedAt.toISOString(),
              },
              sizeId: variant.sizeId,
              quantity: variant.quantity,
            };
          }),
      })) || [],
  };
}
