import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetSequences() {
  console.log('🔄 Resetting all sequences...');

  const sequences = [
    'products_id_seq',
    'product_categories_id_seq',
    'product_images_id_seq',
    'product_colors_id_seq',
    'product_variants_id_seq',
    'product_sizes_id_seq',
    'orders_id_seq',
    'order_items_id_seq',
    'product_reviews_id_seq',
    'hero_slides_id_seq',
    'hero_banners_id_seq',
    'companies_id_seq',
  ];

  try {
    // Reset each sequence individually
    for (const seq of sequences) {
      try {
        await prisma.$executeRawUnsafe(`ALTER SEQUENCE IF EXISTS "${seq}" RESTART WITH 1;`);
        console.log(`✅ Reset sequence: ${seq}`);
      } catch (error) {
        console.warn(`⚠️  Could not reset sequence ${seq}:`, (error as Error).message);
      }
    }

    console.log('✅ All sequences reset successfully!');
  } catch (error) {
    console.error('❌ Error resetting sequences:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

resetSequences()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  });

