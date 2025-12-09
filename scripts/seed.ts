import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// دالة لحساب وتحديث متوسط التقييمات
async function updateProductRating(productId: number): Promise<void> {
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
    const sum = reviews.reduce((acc: number, review: { rating: number }) => acc + review.rating, 0);
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

interface ProductData {
  productTitle: string;
  productPrice: number;
  productDiscription: string;
  productRating: number;
  category: 'men' | 'women' | 'children' | 'accessories' | 'shoes';
  images: string[];
}

const sampleProducts: ProductData[] = [
  {
    productTitle: 'Classic Men\'s T-Shirt',
    productPrice: 29.99,
    productDiscription: 'Comfortable and stylish classic men\'s t-shirt made from premium cotton. Perfect for everyday wear.',
    productRating: 4.5,
    category: 'men',
    images: ['/images/1.jpg', '/images/1/final.png', '/images/1/images.jpg'],
  },
  {
    productTitle: 'Women\'s Summer Dress',
    productPrice: 49.99,
    productDiscription: 'Beautiful summer dress with elegant design. Lightweight and perfect for warm weather.',
    productRating: 4.8,
    category: 'women',
    images: ['/images/2.jpg', '/images/2/2.jpg', '/images/2/3.jpg', '/images/2/final.jpg'],
  },
  {
    productTitle: 'Men\'s Casual Jeans',
    productPrice: 79.99,
    productDiscription: 'High-quality denim jeans with perfect fit. Durable and comfortable for all occasions.',
    productRating: 4.6,
    category: 'men',
    images: ['/images/3/1.jpg', '/images/3/2.jpg', '/images/3/4.jpg', '/images/3/final.jpg'],
  },
  {
    productTitle: 'Women\'s Elegant Blouse',
    productPrice: 39.99,
    productDiscription: 'Elegant blouse with modern design. Perfect for office or casual occasions.',
    productRating: 4.7,
    category: 'women',
    images: ['/images/4/3.jpg', '/images/4/4.jpg', '/images/4/final.jpg'],
  },
  {
    productTitle: 'Men\'s Sport Shoes',
    productPrice: 89.99,
    productDiscription: 'Comfortable sport shoes with excellent support. Ideal for running and daily activities.',
    productRating: 4.9,
    category: 'men',
    images: ['/images/5/1 (5).jpg', '/images/5/1 (6).jpg', '/images/5/100.jpg'],
  },
  {
    productTitle: 'Women\'s High Heels',
    productPrice: 69.99,
    productDiscription: 'Stylish high heels with comfortable design. Perfect for special occasions.',
    productRating: 4.4,
    category: 'women',
    images: ['/images/6/1.jpg', '/images/6/2.jpg'],
  },
  {
    productTitle: 'Men\'s Leather Jacket',
    productPrice: 199.99,
    productDiscription: 'Premium leather jacket with classic design. Durable and stylish.',
    productRating: 4.8,
    category: 'men',
    images: ['/images/banner-15.jpg', '/images/banner-16.jpg'],
  },
  {
    productTitle: 'Women\'s Winter Coat',
    productPrice: 149.99,
    productDiscription: 'Warm and stylish winter coat. Perfect for cold weather with elegant design.',
    productRating: 4.7,
    category: 'women',
    images: ['/images/banner-17.jpg', '/images/banner-25.jpg'],
  },
  {
    productTitle: 'Men\'s Formal Shirt',
    productPrice: 59.99,
    productDiscription: 'Classic formal shirt perfect for business occasions. Premium quality fabric.',
    productRating: 4.6,
    category: 'men',
    images: ['/images/more/1.jpg', '/images/more/2.jpg', '/images/more/3.jpg'],
  },
  {
    productTitle: 'Women\'s Casual Top',
    productPrice: 34.99,
    productDiscription: 'Comfortable casual top with modern design. Perfect for everyday wear.',
    productRating: 4.5,
    category: 'women',
    images: ['/images/more/4.jpg', '/images/more/5.jpg', '/images/more/6.jpg'],
  },
  {
    productTitle: 'Men\'s Watch',
    productPrice: 129.99,
    productDiscription: 'Elegant men\'s watch with premium design. Water-resistant and durable.',
    productRating: 4.9,
    category: 'men',
    images: ['/images/more/7.jpg', '/images/more/8.jpg'],
  },
  {
    productTitle: 'Women\'s Handbag',
    productPrice: 79.99,
    productDiscription: 'Stylish handbag with spacious design. Perfect for daily use.',
    productRating: 4.6,
    category: 'women',
    images: ['/images/more/10.jpg', '/images/more/100.jpg'],
  },
  {
    productTitle: 'NASA Space Bear T-Shirt',
    productPrice: 39.99,
    productDiscription: 'Unique NASA Space Bear print t-shirt. Casual loose short sleeve design.',
    productRating: 4.7,
    category: 'children',
    images: ['/images/more/Mens NASA Space Bear Print O-Neck Casual Loose Short Sleeve T-Shirt.png', '/images/more/Mens NASA Space Bear Print O-Neck Casual Loose Short Sleeve T-Shirt (1).jfif'],
  },
  {
    productTitle: 'Paper Plane Liberty T-Shirt',
    productPrice: 44.99,
    productDiscription: 'Stylish Paper Plane of Liberty print crew neck short sleeve t-shirt. Available in multiple colors.',
    productRating: 4.8,
    category: 'men',
    images: ['/images/more/Paper Plane of Liberty Print Crew Neck Short Sleeve T-Shirts - Black _ XL.png', '/images/more/Paper Plane of Liberty Print Crew Neck Short Sleeve T-Shirts - White _ XL.png'],
  },
  {
    productTitle: 'Women\'s Fashion Top',
    productPrice: 54.99,
    productDiscription: 'Trendy fashion top with modern design. Perfect for any occasion.',
    productRating: 4.6,
    category: 'women',
    images: ['/images/more/1 (1).jpg', '/images/more/1 (2).jpg', '/images/more/1 (3).jpg'],
  },
];

const heroSlides = [
  {
    tagLine: 'LIFESTYLE COLLECTION',
    title: 'MEN',
    highlight: 'SALE UP TO',
    saleText: '30% OFF',
    description: 'Get Free Shipping on orders over $99.00',
    buttonText: 'shop now',
    buttonLink: '/shop',
    imageUrl: '/images/banner-15.jpg',
    accentColor: '#D23F57',
    sortOrder: 1,
  },
  {
    tagLine: 'NEVER MISS A DROP',
    title: 'WOMEN',
    highlight: 'NEW IN',
    saleText: '15% OFF',
    description: 'Fresh arrivals selected weekly just for you.',
    buttonText: 'discover now',
    buttonLink: '/shop',
    imageUrl: '/images/banner-25.jpg',
    accentColor: '#ff7790',
    sortOrder: 2,
  },
];

const heroBanners = [
  {
    title: 'NEW ARRIVALS',
    subtitle: 'SUMMER',
    description: 'SALE 20% OFF',
    buttonText: 'shop now',
    buttonLink: '#',
    imageUrl: '/images/banner-17.jpg',
    textColor: '#2B3445',
    sortOrder: 1,
  },
  {
    title: 'GAMING 4K',
    subtitle: 'DESKTOPS &\nLAPTOPS',
    description: '',
    buttonText: 'shop now',
    buttonLink: '#',
    imageUrl: '/images/banner-16.jpg',
    textColor: '#FFFFFF',
    sortOrder: 2,
  },
];

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  // First clear hero slides so constraints don't conflict
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  try {
    await (prisma as any).heroSlide?.deleteMany?.();
  } catch (e) {
    console.warn('⚠️  Could not clear hero slides:', (e as Error).message);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  try {
    await (prisma as any).heroBanner?.deleteMany?.();
  } catch (e) {
    console.warn('⚠️  Could not clear hero banners:', (e as Error).message);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  try {
    await (prisma as any).productReview?.deleteMany?.();
  } catch (e) {
    console.warn('⚠️  Could not clear product reviews:', (e as Error).message);
  }
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.productCategory.deleteMany();

  // Create categories
  console.log('📁 Creating categories...');
  const categories = [
    { name: 'Men', slug: 'men', description: 'Men\'s clothing and accessories', sortOrder: 1 },
    { name: 'Women', slug: 'women', description: 'Women\'s clothing and accessories', sortOrder: 2 },
    { name: 'Children', slug: 'children', description: 'Children\'s clothing and accessories', sortOrder: 3 },
    { name: 'Accessories', slug: 'accessories', description: 'Fashion accessories', sortOrder: 4 },
    { name: 'Shoes', slug: 'shoes', description: 'Footwear for all ages', sortOrder: 5 },
    { name: 'Electronics', slug: 'electronics', description: 'Electronic devices and gadgets', sortOrder: 6 },
    { name: 'Beauty', slug: 'beauty', description: 'Beauty and personal care products', sortOrder: 7 },
    { name: 'Home', slug: 'home', description: 'Home and living products', sortOrder: 8 },
  ];

  const categoryMap: Record<string, number> = {};
  for (const catData of categories) {
    const category = await prisma.productCategory.create({
      data: catData,
    });
    categoryMap[catData.slug] = category.id;
    console.log(`✅ Created category: ${category.name} (ID: ${category.id})`);
  }

  // Create products
  console.log('📦 Creating products...');
  for (const productData of sampleProducts) {
    const categoryId = categoryMap[productData.category];
    if (!categoryId) {
      console.warn(`⚠️  Category "${productData.category}" not found, skipping product: ${productData.productTitle}`);
      continue;
    }

    const product = await prisma.product.create({
      data: {
        productTitle: productData.productTitle,
        productPrice: productData.productPrice,
        productDiscription: productData.productDiscription,
        productRating: productData.productRating,
        categoryId: categoryId,
        images: {
          create: productData.images.map((imageUrl, index) => ({
            imageUrl,
            imageOrder: index,
          })),
        },
        colors: {
          create: [
            {
              colorName: 'أسود',
              colorCode: '#000000',
              variants: {
                create: [
                  { size: 'S', quantity: Math.floor(Math.random() * 20) + 5 },
                  { size: 'M', quantity: Math.floor(Math.random() * 20) + 10 },
                  { size: 'L', quantity: Math.floor(Math.random() * 20) + 8 },
                  { size: 'XL', quantity: Math.floor(Math.random() * 15) + 5 },
                  { size: 'X2XL', quantity: Math.floor(Math.random() * 10) + 3 },
                  { size: 'X3XL', quantity: Math.floor(Math.random() * 5) + 1 },
                ],
              },
            },
            {
              colorName: 'أبيض',
              colorCode: '#FFFFFF',
              variants: {
                create: [
                  { size: 'S', quantity: Math.floor(Math.random() * 20) + 5 },
                  { size: 'M', quantity: Math.floor(Math.random() * 20) + 10 },
                  { size: 'L', quantity: Math.floor(Math.random() * 20) + 8 },
                  { size: 'XL', quantity: Math.floor(Math.random() * 15) + 5 },
                  { size: 'X2XL', quantity: Math.floor(Math.random() * 10) + 3 },
                  { size: 'X3XL', quantity: Math.floor(Math.random() * 5) + 1 },
                ],
              },
            },
            {
              colorName: 'أزرق',
              colorCode: '#0066CC',
              variants: {
                create: [
                  { size: 'S', quantity: Math.floor(Math.random() * 15) + 3 },
                  { size: 'M', quantity: Math.floor(Math.random() * 15) + 8 },
                  { size: 'L', quantity: Math.floor(Math.random() * 15) + 6 },
                  { size: 'XL', quantity: Math.floor(Math.random() * 10) + 3 },
                  { size: 'X2XL', quantity: Math.floor(Math.random() * 8) + 2 },
                ],
              },
            },
          ],
        },
      },
    });
    console.log(`✅ Created product: ${product.productTitle} (ID: ${product.id})`);

    // Seed some reviews for each product
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma as any).productReview?.createMany?.({
      data: [
        {
          productId: product.id,
          author: 'أحمد',
          rating: Math.floor(Math.random() * 2) + 4,
          comment: 'منتج ممتاز، الجودة عالية والتغليف رائع. أنصح بشرائه.',
        },
        {
          productId: product.id,
          author: 'سارة',
          rating: Math.floor(Math.random() * 3) + 3,
          comment: 'الخامة جيدة جداً والمقاس مناسب، لكن الشحن تأخر قليلاً.',
        },
      ],
    });

    // تحديث متوسط التقييمات للمنتج
    await updateProductRating(product.id);
  }

  // Seed hero slides
  console.log('🎞️ Seeding hero slides...');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const heroDelegate = (prisma as any).heroSlide;
  if (heroDelegate) {
    for (const slide of heroSlides) {
      const created = await heroDelegate.create({ data: slide });
      console.log(`✅ Created hero slide: ${created.title} (ID: ${created.id})`);
    }
  } else {
    console.warn('⚠️ heroSlide model not found on Prisma client. Did you run `npx prisma generate`?');
  }

  // Seed hero side banners
  console.log('🖼️ Seeding hero side banners...');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bannerDelegate = (prisma as any).heroBanner;
  if (bannerDelegate) {
    for (const banner of heroBanners) {
      const created = await bannerDelegate.create({ data: banner });
      console.log(`✅ Created hero banner: ${created.title} (ID: ${created.id})`);
    }
  } else {
    console.warn('⚠️ heroBanner model not found on Prisma client. Did you run `npx prisma generate`?');
  }

  console.log('✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

