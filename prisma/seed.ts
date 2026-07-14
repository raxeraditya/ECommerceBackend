import { createPrismaClient } from "../src/lib/prisma";
import { faker } from "@faker-js/faker";

const prisma = createPrismaClient();
async function main() {
  console.log("🌱 Starting database seeding...");

  // Delete existing products to avoid conflicts
  await prisma.product.deleteMany();

  const totalProducts = 75;
  const products = [];

  for (let i = 1; i <= totalProducts; i++) {
    const imageUrl = `https://picsum.photos/seed/product-${i}/600/400`;

    products.push({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 10, max: 999, dec: 2 })),
      imageUrl: imageUrl,
    });
  }

  const created = await prisma.product.createMany({
    data: products,
  });

  console.log(`✅ Successfully seeded ${created.count} products!`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
