import { prisma } from './prisma';
import type { Product, ProductCategory } from '@/types/product';

export async function getAllProducts(category?: ProductCategory): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: category ? { category } : undefined,
    include: {
      images: {
        orderBy: {
          imageOrder: 'asc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return products.map((product: any) => ({
    id: product.id,
    productTitle: product.productTitle,
    productPrice: Number(product.productPrice),
    productDiscription: product.productDiscription,
    productRating: Number(product.productRating),
    category: product.category,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    productimg: product.images.map((img: any) => ({
      id: img.id,
      url: img.imageUrl.startsWith('http') ? img.imageUrl : img.imageUrl,
      image_order: img.imageOrder,
    })),
  }));
}

export async function getProductById(id: number): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: {
          imageOrder: 'asc',
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
    category: product.category,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    productimg: product.images.map((img: any) => ({
      id: img.id,
      url: img.imageUrl.startsWith('http') ? img.imageUrl : img.imageUrl,
      image_order: img.imageOrder,
    })),
  };
}

export async function createProduct(product: {
  productTitle: string;
  productPrice: number;
  productDiscription: string;
  productRating: number;
  category: ProductCategory;
  images: string[];
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
      category: product.category,
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

  // Fetch product with images
  const productWithImages = await prisma.product.findUnique({
    where: { id: newProduct.id },
    include: {
      images: {
        orderBy: {
          imageOrder: 'asc',
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
  console.log('Image details:', productWithImages.images.map((img: any) => ({
    id: img.id,
    url: img.imageUrl,
    order: img.imageOrder,
  })));

  return {
    id: productWithImages.id,
    productTitle: productWithImages.productTitle,
    productPrice: Number(productWithImages.productPrice),
    productDiscription: productWithImages.productDiscription,
    productRating: Number(productWithImages.productRating),
    category: productWithImages.category,
    createdAt: productWithImages.createdAt.toISOString(),
    updatedAt: productWithImages.updatedAt.toISOString(),
    productimg: productWithImages.images.map((img: any) => ({
      id: img.id,
      url: img.imageUrl.startsWith('http') ? img.imageUrl : img.imageUrl,
      image_order: img.imageOrder,
    })),
  };
}
