import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ProductData {
  productTitle: string;
  productPrice: number;
  productDiscription: string;
  productRating: number;
  category: 'men' | 'women';
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
    category: 'men',
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
  await (prisma as any).heroSlide?.deleteMany?.();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (prisma as any).heroBanner?.deleteMany?.();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();

  // Create products
  console.log('📦 Creating products...');
  for (const productData of sampleProducts) {
    const product = await prisma.product.create({
      data: {
        productTitle: productData.productTitle,
        productPrice: productData.productPrice,
        productDiscription: productData.productDiscription,
        productRating: productData.productRating,
        category: productData.category,
        images: {
          create: productData.images.map((imageUrl, index) => ({
            imageUrl,
            imageOrder: index,
          })),
        },
      },
    });
    console.log(`✅ Created product: ${product.productTitle} (ID: ${product.id})`);
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

