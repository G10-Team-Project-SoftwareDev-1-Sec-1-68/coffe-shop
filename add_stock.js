const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addStock() {
  await prisma.ingredient.updateMany({
    data: {
      stockQty: 100
    }
  });
  console.log("Added 100 stock to all ingredients.");
}

addStock()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
