const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const variant = await prisma.productVariant.findFirst({
    include: { product: true }
  });

  if (!variant) {
    console.log("No products found in DB! Please create a product first.");
    process.exit(1);
  }

  const order = await prisma.order.create({
    data: {
      orderNumber: "TKT-" + Math.floor(1000 + Math.random() * 9000),
      totalAmount: variant.price,
      status: "PENDING",
      type: "DINE_IN",
      pickupMethod: "STORE_PICKUP",
      items: {
        create: [
          {
            variantId: variant.id,
            quantity: 1,
            priceAtTime: variant.price,
            options: JSON.stringify({ sweetness: 50, extraShot: 1 })
          }
        ]
      }
    }
  });

  console.log("Created Mock Order:", order.orderNumber);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
