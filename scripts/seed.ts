import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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
  category: 'men' | 'women' | 'children' | 'accessories' | 'shoes' | 'electronics' | 'beauty' | 'home' | 'fruits';
  images: string[];
  sizeType: 'clothing' | 'shoes' | 'none'; // نوع المقاسات
  hasColors?: boolean; // إذا كان false، المنتج بدون ألوان (كمية فقط في Product.quantity)
}


// بيانات المستخدمين
const users = [
  {
    name: 'Tah57',
    email: 'tah@gmail.com',
    password: '123456',
    role: 'ADMIN',
  },
  {
    name: 'Ali',
    email: 'ali@gmail.com',
    password: '123456',
    role: 'USER',
  },
  {
    name: 'سارة علي',
    email: 'sara@gmail.com',
    password: '123456',
    role: 'USER',
  },
  {
    name: 'محمد حسن',
    email: 'mohamed@example.com',
    password: 'User@123',
    role: 'USER',
  },
  {
    name: 'فاطمة عبدالله',
    email: 'fatima@example.com',
    password: 'User@123',
    role: 'USER',
  },
];


const sampleProducts: ProductData[] = [
  // Men's Clothing
  {
    productTitle: 'Classic Men\'s T-Shirt',
    productPrice: 29.99,
    productDiscription: 'Comfortable and stylish classic men\'s t-shirt made from premium cotton. Perfect for everyday wear.',
    productRating: 4.5,
    category: 'men',
    sizeType: 'clothing',
    images: [ '/images/men1/final.png', '/images/men1/images.jpg'],
  },
  {
    productTitle: 'Men\'s Sport Shoes',
    productPrice: 89.99,
    productDiscription: 'Comfortable sport shoes with excellent support. Ideal for running and daily activities.',
    productRating: 4.9,
    category: 'shoes',
    sizeType: 'shoes',
    images: ['/images/men2/1 (5).jpg', '/images/men2/1 (6).jpg', '/images/men2/100.jpg'],
  },
  {
    productTitle: 'Men\'s Casual Jeans',
    productPrice: 79.99,
    productDiscription: 'High-quality denim jeans with perfect fit. Durable and comfortable for all occasions.',
    productRating: 4.6,
    category: 'men',
    sizeType: 'clothing',
    images: ['/images/men3/1.jpg', '/images/men3/2.jpg'],
  },
  {
    productTitle: 'Men\'s Formal Shirt',
    productPrice: 59.99,
    productDiscription: 'Classic formal shirt perfect for business occasions. Premium quality fabric.',
    productRating: 4.6,
    category: 'men',
    sizeType: 'clothing',
    images: ['/images/men4/1.jpg', '/images/men4/2.jpg', '/images/men4/3.jpg'],
  },
  {
    productTitle: 'Men\'s Polo Shirt',
    productPrice: 45.99,
    productDiscription: 'Classic polo shirt with modern fit. Perfect for casual and semi-formal occasions.',
    productRating: 4.7,
    category: 'men',
    sizeType: 'clothing',
    images: ['/images/men5/1.jpg', '/images/men5/2.jpg'],
  },
  {
    productTitle: 'Men\'s Hoodie',
    productPrice: 65.99,
    productDiscription: 'Warm and comfortable hoodie with soft fabric. Perfect for casual wear.',
    productRating: 4.5,
    category: 'men',
    sizeType: 'clothing',
    images: ['/images/men6/1.jpg', '/images/men6/2.jpg'],
  },
  
  // Men's Shoes
  {
    productTitle: 'Men\'s Casual Sneakers',
    productPrice: 79.99,
    productDiscription: 'Stylish casual sneakers with comfortable sole. Perfect for everyday wear.',
    productRating: 4.7,
    category: 'shoes',
    sizeType: 'shoes',
    images: ['/images/shoes1/1.jpg', '/images/shoes1/2.jpg', '/images/shoes1/3.jpg'],
  },
  {
    productTitle: 'Men\'s Formal Dress Shoes',
    productPrice: 129.99,
    productDiscription: 'Elegant formal dress shoes with premium leather. Perfect for business and formal events.',
    productRating: 4.8,
    category: 'shoes',
    sizeType: 'shoes',
    images: ['/images/shoes2/1.jpg', '/images/shoes2/2.jpg'],
  },
  {
    productTitle: 'Men\'s Running Shoes',
    productPrice: 99.99,
    productDiscription: 'High-performance running shoes with advanced cushioning technology.',
    productRating: 4.9,
    category: 'shoes',
    sizeType: 'shoes',
    images: ['/images/shoes3/1.jpg', '/images/shoes3/2.jpg'],
  },
  
  // Men's Accessories - بدون ألوان (كمية فقط)
  {
    productTitle: 'Men\'s Luxury Watch',
    productPrice: 129.99,
    productDiscription: 'Elegant luxury men\'s watch with premium design and water-resistant features. Swiss movement and genuine leather strap. Perfect for formal occasions and daily wear.',
    productRating: 4.9,
    category: 'accessories',
    sizeType: 'none',
    hasColors: false,
    images: ['/images/Accessories1/3.jpg', '/images/Accessories1/4.jpg', '/images/Accessories1/final.jpg'],
  },
  {
    productTitle: 'Men\'s Classic Watch',
    productPrice: 49.99,
    productDiscription: 'Classic men\'s watch with timeless design. Durable stainless steel case and comfortable strap. Perfect for everyday use and professional settings.',
    productRating: 4.6,
    category: 'accessories',
    sizeType: 'none',
    hasColors: false,
    images: ['/images/Accessories2/1.jpg', '/images/Accessories2/2.jpg'],
  },
  {
    productTitle: 'Men\'s Sport Watch',
    productPrice: 59.99,
    productDiscription: 'Modern sport watch with advanced features including stopwatch and date display. Water-resistant up to 100m and durable for active lifestyle.',
    productRating: 4.7,
    category: 'accessories',
    sizeType: 'none',
    hasColors: false,
    images: ['/images/Accessories3/1.jpg', '/images/Accessories3/2.jpg', '/images/Accessories3/3.jpg'],
  },
  {
    productTitle: 'Men\'s Leather Bracelet',
    productPrice: 39.99,
    productDiscription: 'Stylish men\'s bracelet with elegant design. Made from premium genuine leather for durability and comfort. Adjustable size fits all wrists.',
    productRating: 4.6,
    category: 'accessories',
    sizeType: 'none',
    hasColors: false,
    images: ['/images/Accessories4/1.jpg', '/images/Accessories4/2.jpg'],
  },
  {
    productTitle: 'Men\'s Silver Earrings',
    productPrice: 24.99,
    productDiscription: 'Elegant silver earrings for men with modern minimalist design. Hypoallergenic material. Perfect for adding a stylish touch to your look.',
    productRating: 4.5,
    category: 'accessories',
    sizeType: 'none',
    hasColors: false,
    images: ['/images/Accessories5/1.jpg', '/images/Accessories5/2.jpg'],
  },
  {
    productTitle: 'Men\'s Gold Earrings',
    productPrice: 69.99,
    productDiscription: 'Premium gold-plated earrings for men with sophisticated design. High-quality materials ensure long-lasting shine. Perfect for special occasions.',
    productRating: 4.7,
    category: 'accessories',
    sizeType: 'none',
    hasColors: false,
    images: ['/images/Accessories6/1.jpg', '/images/Accessories6/2.jpg', '/images/Accessories6/3.jpg'],
  },
  {
    productTitle: 'Men\'s Chain Necklace',
    productPrice: 34.99,
    productDiscription: 'Classic chain necklace for men with adjustable length. Made from high-quality stainless steel for lasting durability and shine.',
    productRating: 4.6,
    category: 'accessories',
    sizeType: 'none',
    hasColors: false,
    images: ['/images/Accessories7/1.jpg', '/images/Accessories7/2.jpg'],
  },
  {
    productTitle: 'Men\'s Aviator Sunglasses',
    productPrice: 44.99,
    productDiscription: 'Classic aviator sunglasses with 100% UV protection. Polarized lenses reduce glare. Stylish design perfect for sunny days and outdoor activities.',
    productRating: 4.7,
    category: 'accessories',
    sizeType: 'none',
    hasColors: false,
    images: ['/images/Accessories8/2.jpg', '/images/Accessories8/3.jpg', '/images/Accessories8/final.jpg'],
  },
  {
    productTitle: 'Men\'s Wayfarer Sunglasses',
    productPrice: 29.99,
    productDiscription: 'Timeless wayfarer sunglasses with UV400 protection. Classic design that never goes out of style. Durable frame and scratch-resistant lenses.',
    productRating: 4.5,
    category: 'accessories',
    sizeType: 'none',
    hasColors: false,
    images: ['/images/Accessories9/1.jpg', '/images/Accessories9/2.jpg'],
  },
  {
    productTitle: 'Men\'s Leather Messenger Bag',
    productPrice: 49.99,
    productDiscription: 'Premium genuine leather messenger bag with spacious compartments and laptop sleeve. Perfect for work, travel, and daily use. Adjustable shoulder strap.',
    productRating: 4.6,
    category: 'accessories',
    sizeType: 'none',
    hasColors: false,
    images: ['/images/Accessories10/1.jpg', '/images/Accessories10/2.jpg', '/images/Accessories10/4.jpg', '/images/Accessories10/final.jpg'],
  },
  {
    productTitle: 'Men\'s Crossbody Bag',
    productPrice: 39.99,
    productDiscription: 'Stylish crossbody bag with modern design and multiple pockets. Compact and functional, perfect for everyday essentials. Water-resistant material.',
    productRating: 4.5,
    category: 'accessories',
    sizeType: 'none',
    hasColors: false,
    images: ['/images/Accessories11/1.jpg', '/images/Accessories11/2.jpg'],
  },
  {
    productTitle: 'Men\'s Slim Wallet',
    productPrice: 19.99,
    productDiscription: 'Compact slim wallet with multiple card slots and cash compartment. RFID blocking technology. Sleek design perfect for minimalists and daily use.',
    productRating: 4.4,
    category: 'accessories',
    sizeType: 'none',
    hasColors: false,
    images: ['/images/Accessories12/1.jpg', '/images/Accessories12/2.jpg'],
  },
  
  // Women's Clothing
  {
    productTitle: 'Women\'s Summer Dress',
    productPrice: 49.99,
    productDiscription: 'Beautiful summer dress with elegant design. Lightweight and perfect for warm weather.',
    productRating: 4.8,
    category: 'women',
    sizeType: 'clothing',
    images: [ '/images/women1/1.jpg', '/images/women1/2.jpg'],
  },
  {
    productTitle: 'Women\'s Elegant Blouse',
    productPrice: 39.99,
    productDiscription: 'Elegant blouse with modern design. Perfect for office or casual occasions.',
    productRating: 4.7,
    category: 'women',
    sizeType: 'clothing',
    images: ['/images/women2/1.jpg', '/images/women2/2.jpg'],
  },
 
  {
    productTitle: 'Women\'s Casual Top',
    productPrice: 34.99,
    productDiscription: 'Comfortable casual top with modern design. Perfect for everyday wear.',
    productRating: 4.5,
    category: 'women',
    sizeType: 'clothing',
    images: ['/images/women3/1.jpg', '/images/women3/2.jpg'],
  },
  {
    productTitle: 'Women\'s Fashion Top',
    productPrice: 54.99,
    productDiscription: 'Trendy fashion top with modern design. Perfect for any occasion.',
    productRating: 4.6,
    category: 'women',
    sizeType: 'clothing',
    images: ['/images/women4/1.jpg', '/images/women4/2.jpg'],
  },
  {
    productTitle: 'Women\'s Jeans',
    productPrice: 69.99,
    productDiscription: 'Stylish women\'s jeans with perfect fit. Comfortable and flattering.',
    productRating: 4.6,
    category: 'women',
    sizeType: 'clothing',
    images: ['/images/women5/1.jpg', '/images/women5/2.jpg'],
  },
  {
    productTitle: 'Women\'s Skirt',
    productPrice: 44.99,
    productDiscription: 'Elegant skirt with flowing design. Perfect for office and casual wear.',
    productRating: 4.5,
    category: 'women',
    sizeType: 'clothing',
    images: ['/images/women6/1.jpg', '/images/women6/2.jpg'],
  },
  {
    productTitle: 'Women\'s Cardigan',
    productPrice: 59.99,
    productDiscription: 'Soft cardigan with elegant design. Perfect for layering.',
    productRating: 4.7,
    category: 'women',
    sizeType: 'clothing',
    images: ['/images/women7/1.jpg', '/images/women7/2.jpg'],
  },
  {
    productTitle: 'Women\'s Blazer',
    productPrice: 79.99,
    productDiscription: 'Elegant blazer with modern fit. Perfect for professional occasions.',
    productRating: 4.6,
    category: 'women',
    sizeType: 'clothing',
    images: ['/images/women8/1.jpg', '/images/women8/2.jpg'],
  },
  {
    productTitle: 'Women\'s Sweater',
    productPrice: 65.99,
    productDiscription: 'Warm sweater with elegant design. Perfect for winter season.',
    productRating: 4.7,
    category: 'women',
    sizeType: 'clothing',
    images: ['/images/women9/1.jpg', '/images/women9/2.jpg'],
  },
  
  // Women's Shoes
  {
    productTitle: 'Women\'s High Heels',
    productPrice: 69.99,
    productDiscription: 'Stylish high heels with comfortable design. Perfect for special occasions.',
    productRating: 4.4,
    category: 'shoes',
    sizeType: 'shoes',
    images: ['/images/shoes1/1.jpg', '/images/shoes1/2.jpg', '/images/shoes1/3.jpg'],
  },
  {
    productTitle: 'Women\'s Flat Shoes',
    productPrice: 54.99,
    productDiscription: 'Comfortable flat shoes with elegant design. Perfect for everyday wear.',
    productRating: 4.6,
    category: 'shoes',
    sizeType: 'shoes',
    images: ['/images/shoes2/1.jpg', '/images/shoes2/2.jpg'],
  },
  {
    productTitle: 'Women\'s Boots',
    productPrice: 89.99,
    productDiscription: 'Stylish boots with comfortable fit. Perfect for winter season.',
    productRating: 4.7,
    category: 'shoes',
    sizeType: 'shoes',
    images: ['/images/shoes3/1.jpg', '/images/shoes3/2.jpg'],
  },
  
  // Women's Accessories - بدون ألوان (كمية فقط)
  {
    productTitle: 'Women\'s Elegant Watch',
    productPrice: 79.99,
    productDiscription: 'Beautiful elegant watch for women with premium design and mother-of-pearl dial. Perfect for both casual and formal occasions. Water-resistant up to 30m.',
    productRating: 4.6,
    category: 'accessories',
    sizeType: 'none',
    hasColors: false,
    images: ['/images/Accessories1/3.jpg', '/images/Accessories1/4.jpg', '/images/Accessories1/final.jpg'],
  },
  {
    productTitle: 'Women\'s Classic Watch',
    productPrice: 49.99,
    productDiscription: 'Timeless classic watch for women with sophisticated design. Water-resistant and durable for daily wear. Elegant rose gold finish.',
    productRating: 4.7,
    category: 'accessories',
    sizeType: 'none',
    hasColors: false,
    images: ['/images/Accessories2/1.jpg', '/images/Accessories2/2.jpg'],
  },
  {
    productTitle: 'Women\'s Fashion Watch',
    productPrice: 29.99,
    productDiscription: 'Stylish fashion watch for women with modern minimalist design. Perfect accessory to complement any outfit. Lightweight and comfortable.',
    productRating: 4.6,
    category: 'accessories',
    sizeType: 'none',
    hasColors: false,
    images: ['/images/Accessories3/1.jpg', '/images/Accessories3/2.jpg', '/images/Accessories3/3.jpg'],
  },
  
  // Children's Clothing
  {
    productTitle: 'Children\'s T-Shirt',
    productPrice: 24.99,
    productDiscription: 'Comfortable t-shirt for children with fun designs. Perfect for everyday wear.',
    productRating: 4.6,
    category: 'children',
    sizeType: 'clothing',
    images: ['/images/Children1/1.jpg', '/images/Children1/2.jpg'],
  },
  {
    productTitle: 'Children\'s Jeans',
    productPrice: 34.99,
    productDiscription: 'Durable children\'s jeans with comfortable fit. Perfect for active kids.',
    productRating: 4.5,
    category: 'children',
    sizeType: 'clothing',
    images: ['/images/Children2/1.jpg', '/images/Children2/2.jpg'],
  },
  {
    productTitle: 'Children\'s Dress',
    productPrice: 44.99,
    productDiscription: 'Beautiful children\'s dress with colorful design. Perfect for special occasions.',
    productRating: 4.6,
    category: 'children',
    sizeType: 'clothing',
    images: ['/images/Children3/1.jpg', '/images/Children3/2.jpg'],
  },
  {
    productTitle: 'Children\'s Hoodie',
    productPrice: 39.99,
    productDiscription: 'Warm and comfortable hoodie for children. Soft fabric and fun design.',
    productRating: 4.5,
    category: 'children',
    sizeType: 'clothing',
    images: ['/images/Children4/1.jpg', '/images/Children4/2.jpg'],
  },
  {
    productTitle: 'Children\'s Shorts',
    productPrice: 29.99,
    productDiscription: 'Comfortable shorts for children. Perfect for summer activities.',
    productRating: 4.4,
    category: 'children',
    sizeType: 'clothing',
    images: ['/images/Children5/1.jpg', '/images/Children5/2.jpg'],
  },
  
  // Children's Shoes
  {
    productTitle: 'Children\'s Sneakers',
    productPrice: 49.99,
    productDiscription: 'Comfortable sneakers for children. Durable and perfect for active play.',
    productRating: 4.6,
    category: 'shoes',
    sizeType: 'shoes',
    images: ['/images/shoes1/1.jpg', '/images/shoes1/2.jpg', '/images/shoes1/3.jpg'],
  },
  {
    productTitle: 'Children\'s Sandals',
    productPrice: 29.99,
    productDiscription: 'Comfortable sandals for children. Perfect for summer activities.',
    productRating: 4.4,
    category: 'shoes',
    sizeType: 'shoes',
    images: ['/images/shoes2/1.jpg', '/images/shoes2/2.jpg'],
  },
  
  // Electronics - بدون ألوان (كمية فقط)
  {
    productTitle: 'Wireless Earbuds',
    productPrice: 79.99,
    productDiscription: 'High-quality wireless earbuds with active noise cancellation. Perfect for music lovers. Long battery life and crystal-clear sound quality.',
    productRating: 4.8,
    category: 'electronics',
    sizeType: 'none',
    hasColors: false,
    images: ['/images/Electronics1/1.jpg', '/images/Electronics1/2.jpg'],
  },
  {
    productTitle: 'Smart Watch',
    productPrice: 199.99,
    productDiscription: 'Feature-rich smartwatch with advanced fitness tracking. Water-resistant and durable. Monitor your health and stay connected.',
    productRating: 4.7,
    category: 'electronics',
    sizeType: 'none',
    hasColors: false,
    images: ['/images/Electronics2/1.jpg', '/images/Electronics2/2.jpg'],
  },
  {
    productTitle: 'Protective Phone Case',
    productPrice: 19.99,
    productDiscription: 'Durable protective phone case with elegant design. Shock-absorbent material protects your device from drops and scratches.',
    productRating: 4.5,
    category: 'electronics',
    sizeType: 'none',
    hasColors: false,
    images: ['/images/Electronics3/1.jpg', '/images/Electronics3/2.jpg'],
  },
  {
    productTitle: 'Fast Wireless Charger',
    productPrice: 34.99,
    productDiscription: 'Fast wireless charger with sleek modern design. Compatible with all Qi-enabled devices. Charge your phone without cables.',
    productRating: 4.6,
    category: 'electronics',
    sizeType: 'none',
    hasColors: false,
    images: ['/images/Electronics4/1.jpg', '/images/Electronics4/2.jpg'],
  },
  
  // Beauty - بدون ألوان (كمية فقط)
  {
    productTitle: 'Hydrating Face Moisturizer',
    productPrice: 29.99,
    productDiscription: 'Deeply hydrating face moisturizer with natural ingredients. Perfect for all skin types. Keeps your skin soft and glowing all day.',
    productRating: 4.6,
    category: 'beauty',
    sizeType: 'none',
    hasColors: false,
    images: ['/images/beauty1/1.jpg', '/images/beauty1/2.jpg'],
  },
  {
    productTitle: 'Premium Lipstick Set',
    productPrice: 39.99,
    productDiscription: 'Luxury lipstick set with multiple shades. Long-lasting formula with vibrant colors. Perfect for any occasion.',
    productRating: 4.7,
    category: 'beauty',
    sizeType: 'none',
    hasColors: false,
    images: ['/images/beauty2/1.jpg', '/images/beauty2/2.jpg'],
  },
  {
    productTitle: 'Vitamin C Face Serum',
    productPrice: 49.99,
    productDiscription: 'Anti-aging face serum enriched with vitamin C. Brightens and rejuvenates skin. Reduces fine lines and dark spots.',
    productRating: 4.8,
    category: 'beauty',
    sizeType: 'none',
    hasColors: false,
    images: ['/images/beauty3/1.jpg', '/images/beauty3/2.jpg'],
  },
  
  // Home - بدون ألوان (كمية فقط)
  {
    productTitle: 'Decorative Pillow',
    productPrice: 24.99,
    productDiscription: 'Soft decorative pillow with elegant design. Perfect for home decoration. Made from premium materials for comfort and style.',
    productRating: 4.5,
    category: 'home',
    sizeType: 'none',
    hasColors: false, // بدون ألوان - كمية فقط
    images: ['/images/home1/1.jpg', '/images/home1/2.jpg'],
  },
  {
    productTitle: 'Modern Table Lamp',
    productPrice: 49.99,
    productDiscription: 'Sleek modern table lamp with elegant design and adjustable brightness. Perfect for home and office. Energy-efficient LED technology.',
    productRating: 4.6,
    category: 'home',
    sizeType: 'none',
    hasColors: false,
    images: ['/images/home2/1.jpg', '/images/home2/2.jpg'],
  },
  {
    productTitle: 'Elegant Wall Clock',
    productPrice: 39.99,
    productDiscription: 'Stylish wall clock with modern minimalist design. Silent movement mechanism. Perfect for any room in your home or office.',
    productRating: 4.5,
    category: 'home',
    sizeType: 'none',
    hasColors: false,
    images: ['/images/home3/1.jpg', '/images/home3/2.jpg'],
  },
  {
    productTitle: 'Ceramic Vase Set',
    productPrice: 34.99,
    productDiscription: 'Beautiful ceramic vase set with elegant design. Handcrafted with attention to detail. Perfect for home decoration and flower arrangements.',
    productRating: 4.6,
    category: 'home',
    sizeType: 'none',
    hasColors: false,
    images: ['/images/home4/1.jpg', '/images/home4/2.jpg'],
  },
  {
    productTitle: 'Candle Holder',
    productPrice: 29.99,
    productDiscription: 'Elegant candle holder with modern design. Perfect for creating ambiance.',
    productRating: 4.5,
    category: 'home',
    sizeType: 'none',
    hasColors: false, // بدون ألوان - كمية فقط
    images: ['/images/home5/1.jpg', '/images/home5/2.jpg'],
  },
  
  // Fruits - بدون ألوان ولا مقاسات
  {
    productTitle: 'Fresh fruits',
    productPrice: 4.99,
    productDiscription: 'Fresh and crisp red apples, perfect for snacking or cooking. Rich in vitamins and fiber.',
    productRating: 4.8,
    category: 'fruits',
    sizeType: 'none',
    hasColors: false, // بدون ألوان - كمية فقط
    images: ['/images/Fruites/1.jpg', '/images/Fruites/2.jpg'],
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


// بيانات التقييمات للمراجعات
const reviewComments = [
  { rating: 5, comments: ['منتج ممتاز جداً، الجودة عالية والتغليف رائع. أنصح بشرائه بشدة!', 'رائع! تجربة ممتازة، جودة عالية وسعر مناسب.'] },
  { rating: 4, comments: ['الخامة جيدة جداً والمقاس مناسب، لكن الشحن تأخر قليلاً.', 'منتج جيد، يستحق السعر. راضي عن الشراء.'] },
  { rating: 3, comments: ['منتج عادي، مقبول لكن توقعت أفضل من ذلك.', 'جودة متوسطة، السعر مبالغ فيه قليلاً.'] },
];


async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');

  try {
    await (prisma as any).heroSlide?.deleteMany?.();
  } catch (e) {
    console.warn('⚠️  Could not clear hero slides:', (e as Error).message);
  }

  try {
    await (prisma as any).heroBanner?.deleteMany?.();
  } catch (e) {
    console.warn('⚠️  Could not clear hero banners:', (e as Error).message);
  }

  try {
    await prisma.order.deleteMany();
  } catch (e) {
    console.warn('⚠️  Could not clear orders:', (e as Error).message);
  }

  try {
    await (prisma as any).productReview?.deleteMany?.();
  } catch (e) {
    console.warn('⚠️  Could not clear product reviews:', (e as Error).message);
  }

  await prisma.productVariant.deleteMany();
  await prisma.productColor.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.productSize.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.company.deleteMany();

  // Clear authentication tables
  try {
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
  } catch (e) {
    console.warn('⚠️  Could not clear auth tables:', (e as Error).message);
  }

  // Create users
  console.log('👥 Creating users...');
  const createdUsers: any[] = [];

  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role as any,
        emailVerified: new Date(),
      },
    });
    createdUsers.push(user);
    console.log(`✅ Created user: ${user.name} (${user.email}) - Role: ${user.role}`);
  }

  // Create sizes
  console.log('📏 Creating sizes...');
  const sizes = [
    { name: 'S', displayName: 'S', sortOrder: 1 },
    { name: 'M', displayName: 'M', sortOrder: 2 },
    { name: 'L', displayName: 'L', sortOrder: 3 },
    { name: 'XL', displayName: 'XL', sortOrder: 4 },
    { name: 'X2XL', displayName: '2XL', sortOrder: 5 },
    { name: 'X3XL', displayName: '3XL', sortOrder: 6 },
    { name: '22', displayName: '22', sortOrder: 10 },
    { name: '23', displayName: '23', sortOrder: 11 },
    { name: '24', displayName: '24', sortOrder: 12 },
    { name: '25', displayName: '25', sortOrder: 13 },
    { name: '26', displayName: '26', sortOrder: 14 },
    { name: '27', displayName: '27', sortOrder: 15 },
    { name: '28', displayName: '28', sortOrder: 16 },
    { name: '29', displayName: '29', sortOrder: 17 },
    { name: '30', displayName: '30', sortOrder: 18 },
    { name: '31', displayName: '31', sortOrder: 19 },
    { name: '32', displayName: '32', sortOrder: 20 },
    { name: '33', displayName: '33', sortOrder: 21 },
    { name: '34', displayName: '34', sortOrder: 22 },
    { name: '35', displayName: '35', sortOrder: 23 },
    { name: '36', displayName: '36', sortOrder: 24 },
    { name: '37', displayName: '37', sortOrder: 25 },
    { name: '38', displayName: '38', sortOrder: 26 },
    { name: '39', displayName: '39', sortOrder: 27 },
    { name: '40', displayName: '40', sortOrder: 28 },
    { name: '41', displayName: '41', sortOrder: 29 },
    { name: '42', displayName: '42', sortOrder: 30 },
    { name: '43', displayName: '43', sortOrder: 31 },
    { name: '44', displayName: '44', sortOrder: 32 },
    { name: '45', displayName: '45', sortOrder: 33 },
    { name: '46', displayName: '46', sortOrder: 34 },
  ];

  const sizeMap: Record<string, number> = {};
  for (const sizeData of sizes) {
    const size = await prisma.productSize.create({
      data: sizeData,
    });
    sizeMap[sizeData.name] = size.id;
    console.log(`✅ Created size: ${size.displayName} (ID: ${size.id})`);
  }

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
    { name: 'Fruits', slug: 'fruits', description: 'Fresh fruits and produce', sortOrder: 9 },
  ];

  const categoryMap: Record<string, number> = {};
  for (const catData of categories) {
    const category = await prisma.productCategory.create({
      data: catData,
    });
    categoryMap[catData.slug] = category.id;
    console.log(`✅ Created category: ${category.name} (ID: ${category.id})`);
  }

  // Create companies
  console.log('🏢 Creating companies...');
  const companies = [
    { name: 'Nike', slug: 'nike', description: 'Just Do It', email: 'info@nike.com', website: 'https://nike.com', isActive: true },
    { name: 'Adidas', slug: 'adidas', description: 'Impossible is Nothing', email: 'info@adidas.com', website: 'https://adidas.com', isActive: true },
    { name: 'Zara', slug: 'zara', description: 'Fast Fashion', email: 'info@zara.com', website: 'https://zara.com', isActive: true },
    { name: 'H&M', slug: 'hm', description: 'Fashion & Quality', email: 'info@hm.com', website: 'https://hm.com', isActive: true },
    { name: 'Apple', slug: 'apple', description: 'Think Different', email: 'info@apple.com', website: 'https://apple.com', isActive: true },
    { name: 'Samsung', slug: 'samsung', description: 'Innovation for Everyone', email: 'info@samsung.com', website: 'https://samsung.com', isActive: true },
  ];

  const companyMap: Record<string, number> = {};
  for (const companyData of companies) {
    const company = await prisma.company.create({
      data: companyData,
    });
    companyMap[companyData.slug] = company.id;
    console.log(`✅ Created company: ${company.name} (ID: ${company.id})`);
  }

  // Helper functions
  const getSizesForType = (sizeType: 'clothing' | 'shoes' | 'none'): string[] => {
    if (sizeType === 'clothing') {
      return ['S', 'M', 'L', 'XL', 'X2XL', 'X3XL'];
    } else if (sizeType === 'shoes') {
      return ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
    }
    return [];
  };

  const getColorsForProduct = (category: string, sizeType: string) => {
    const baseColors = [
      { colorName: 'أسود', colorCode: '#000000' },
      { colorName: 'أبيض', colorCode: '#FFFFFF' },
    ];

    if (sizeType === 'none') {
      return [
        { colorName: 'أسود', colorCode: '#000000' },
        { colorName: 'أبيض', colorCode: '#FFFFFF' },
        { colorName: 'فضي', colorCode: '#C0C0C0' },
      ];
    }

    return [
      ...baseColors,
      { colorName: 'أزرق', colorCode: '#0066CC' },
      { colorName: 'أحمر', colorCode: '#CC0000' },
      { colorName: 'رمادي', colorCode: '#808080' },
    ];
  };

  // Create products
  console.log('📦 Creating products...');
  const companySlugs = Object.keys(companyMap);
  let companyIndex = 0;

  for (const productData of sampleProducts) {
    const categoryId = categoryMap[productData.category];
    if (!categoryId) {
      console.warn(`⚠️  Category "${productData.category}" not found, skipping product: ${productData.productTitle}`);
      continue;
    }

    const companyId = companyMap[companySlugs[companyIndex % companySlugs.length]] || null;
    companyIndex++;

    const hasColors = productData.hasColors !== false;

    let productQuantity = 0;
    let colorsData: any[] = [];

    if (hasColors) {
      const sizes = getSizesForType(productData.sizeType);
      const colors = getColorsForProduct(productData.category, productData.sizeType);

      colorsData = colors.map((color) => {
        const hasSizes = sizes.length > 0;
        const variants = hasSizes ? sizes.map((sizeName) => {
          const sizeId = sizeMap[sizeName];
          if (!sizeId) {
            console.warn(`⚠️  Size "${sizeName}" not found for product: ${productData.productTitle}`);
            return null;
          }
          const quantity = productData.sizeType === 'shoes'
            ? Math.floor(Math.random() * 10) + 3
            : Math.floor(Math.random() * 20) + 5;
          return { sizeId, quantity };
        }).filter((v): v is { sizeId: number; quantity: number } => v !== null) : [];

        const colorQuantity = !hasSizes
          ? (productData.sizeType === 'none' ? Math.floor(Math.random() * 50) + 10 : 0)
          : 0;

        return {
          colorName: color.colorName,
          colorCode: color.colorCode,
          quantity: colorQuantity,
          variants: {
            create: variants,
          },
        };
      });
    } else {
      if (productData.category === 'fruits') {
        productQuantity = Math.floor(Math.random() * 200) + 50;
      } else if (productData.category === 'home') {
        productQuantity = Math.floor(Math.random() * 30) + 10;
      } else {
        productQuantity = Math.floor(Math.random() * 50) + 10;
      }
    }

    const product = await prisma.product.create({
      data: {
        productTitle: productData.productTitle,
        productPrice: productData.productPrice,
        productDiscription: productData.productDiscription,
        productRating: productData.productRating,
        categoryId: categoryId,
        companyId: companyId,
        quantity: productQuantity,
        images: {
          create: productData.images.map((imageUrl, index) => ({
            imageUrl,
            imageOrder: index,
          })),
        },
        colors: hasColors ? {
          create: colorsData,
        } : undefined,
      },
    });
    console.log(`✅ Created product: ${product.productTitle} (ID: ${product.id})`);

    // إنشاء مراجعات متعددة من مستخدمين مختلفين
    const numReviews = Math.floor(Math.random() * 3) + 2; // 2-4 reviews
    const userIndices = new Set<number>();

    while (userIndices.size < Math.min(numReviews, createdUsers.length - 1)) {
      const randomIndex = Math.floor(Math.random() * (createdUsers.length - 1)) + 1; // تجنب Admin
      userIndices.add(randomIndex);
    }

    for (const userIndex of userIndices) {
      const user = createdUsers[userIndex];
      const reviewData = reviewComments[Math.floor(Math.random() * reviewComments.length)];
      const comment = reviewData.comments[Math.floor(Math.random() * reviewData.comments.length)];

      await (prisma as any).productReview?.create?.({
        data: {
          productId: product.id,
          author: user.name,
          rating: reviewData.rating,
          comment: comment,
        },
      });
    }

    await updateProductRating(product.id);
  }

  // Create sample orders
  console.log('🛒 Creating sample orders...');
  const orderStatuses: any[] = ['pending', 'processing', 'shipped', 'delivered'];

  for (let i = 0; i < 10; i++) {
    const userIndex = Math.floor(Math.random() * (createdUsers.length - 1)) + 1;
    const user = createdUsers[userIndex];

    const products = await prisma.product.findMany({
      take: Math.floor(Math.random() * 3) + 1,
      skip: Math.floor(Math.random() * 10),
    });

    let totalAmount = 0;
    const orderItems = products.map((product) => {
      const quantity = Math.floor(Math.random() * 3) + 1;
      const subtotal = Number(product.productPrice) * quantity;
      totalAmount += subtotal;

      return {
        productId: product.id,
        productTitle: product.productTitle,
        productPrice: product.productPrice,
        quantity: quantity,
        subtotal: subtotal,
      };
    });

    await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-${i}`,
        customerName: user.name || 'Guest',
        customerEmail: user.email,
        customerAddress: `${Math.floor(Math.random() * 100)} شارع الرئيسي`,
        customerCity: 'القاهرة',
        customerPostalCode: '11511',
        customerCountry: 'Egypt',
        totalAmount: totalAmount,
        status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
        items: {
          create: orderItems,
        },
      },
    });
  }
  console.log('✅ Created 10 sample orders');

  // Seed hero slides
  console.log('🎞️ Seeding hero slides...');
  const heroDelegate = (prisma as any).heroSlide;
  if (heroDelegate) {
    for (const slide of heroSlides) {
      const created = await heroDelegate.create({ data: slide });
      console.log(`✅ Created hero slide: ${created.title} (ID: ${created.id})`);
    }
  }

  // Seed hero banners
  console.log('🖼️ Seeding hero side banners...');
  const bannerDelegate = (prisma as any).heroBanner;
  if (bannerDelegate) {
    for (const banner of heroBanners) {
      const created = await bannerDelegate.create({ data: banner });
      console.log(`✅ Created hero banner: ${created.title} (ID: ${created.id})`);
    }
  }

  console.log('✨ Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`👥 Users: ${createdUsers.length}`);
  console.log(`📁 Categories: ${categories.length}`);
  console.log(`🏢 Companies: ${companies.length}`);
  console.log(`📏 Sizes: ${sizes.length}`);
  console.log(`📦 Products: ${sampleProducts.length}`);
  console.log(`🛒 Orders: 10`);
  console.log(`🎞️ Hero Slides: ${heroSlides.length}`);
  console.log(`🖼️ Hero Banners: ${heroBanners.length}`);
  console.log('\n🔐 Login Credentials:');
  console.log('Admin: admin@example.com / Admin@123');
  console.log('User: ahmed@example.com / User@123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });