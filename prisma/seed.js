const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')
const { INGREDIENTS, KAFUNG_MENU, STAFF_USERS } = require('./mockData')
require('dotenv').config()

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 เริ่มต้นการตรวจสอบและ Seed ข้อมูล...')

  // ==========================================
  // 1. ตรวจสอบและ Seed ข้อมูล Users (ทำเสมอด้วย Upsert)
  // ==========================================
  console.log('👤 กำลังตรวจสอบ Admin User...');
  await prisma.user.upsert({
    where: { email: 'admin@kafung.com' },
    update: {},
    create: {
      email: 'admin@kafung.com',
      password: 'hashed_password_here', // ในระแบบจริงควรใช้ bcrypt
      firstName: 'สมหมาย',
      lastName: 'ใจดี',
      role: 'ADMIN',
    },
  });

  console.log('👤 กำลังตรวจสอบ Staff Users...');
  for (const staff of STAFF_USERS) {
    await prisma.user.upsert({
      where: { email: staff.email },
      update: {},
      create: staff,
    });
  }

  // ==========================================
  // 2. ตรวจสอบข้อมูลหลัก (Menu & Ingredients)
  // ==========================================
  const categoryCount = await prisma.category.count();
  const ingredientCount = await prisma.ingredient.count();

  const shouldSeedMenu = categoryCount === 0;
  const shouldSeedIngredients = ingredientCount === 0;

  if (!shouldSeedMenu && !shouldSeedIngredients) {
    console.log('ℹ️ พบข้อมูล Categories และ Ingredients คลบคลังแล้ว จะข้ามการสร้างเมนูเพื่อความปลอดภัย');
    console.log('✅ การ Seed ข้อมูล Users สำเร็จแล้ว!');
    return;
  }

  // ==========================================
  // 2. สร้างวัตถุดิบ (เฉพาะกรณีที่ยังไม่มี)
  // ==========================================
  const ingsMap = {};
  if (shouldSeedIngredients) {
    console.log('📦 กำลังสร้างคลังวัตถุดิบใหม่...');
    for (const item of INGREDIENTS) {
      const created = await prisma.ingredient.create({ data: item });
      ingsMap[item.name] = created.id;
    }
  } else {
    // ถ้ามีอยู่แล้ว ให้ดึง ID มาแมป
    const existingIngs = await prisma.ingredient.findMany();
    existingIngs.forEach(i => ingsMap[i.name] = i.id);
  }

  // ==========================================
  // 3. สร้าง Categories & Products (เฉพาะกรณีที่ยังไม่มี)
  // ==========================================
  if (shouldSeedMenu) {
    console.log('☕ กำลังสร้าง Categories และเมนูสินค้าใหม่...');
    for (const c of KAFUNG_MENU) {
      await prisma.category.create({
        data: {
          name: c.cat,
          sortOrder: c.sortArgs,
          products: {
            create: c.items.map((it, idx) => ({
              name: it.nameEn,
              description: it.descTh,
              imageUrl: it.image,
              variants: {
                 create: [
                   { 
                     name: "Default Mix", 
                     price: it.price, 
                     sku: `SKU-${c.sortArgs}-${idx}`, 
                     recipes: {
                       create: it.recipe.map(r => ({
                         ingredientId: ingsMap[r.ing],
                         quantity: r.qty
                       }))
                     }
                   }
                 ]
              },
              options: {
                create: [
                   { name: "เพิ่มไข่มุก", extraPrice: 10, recipes: { create: [{ ingredientId: ingsMap['ไข่มึก (Pearls)'], quantity: 50 }] } },
                   { name: "เพิ่มช็อต", extraPrice: 15, recipes: { create: [{ ingredientId: ingsMap['เมล็ดกาแฟ (Coffee Beans)'], quantity: 18 }] } }
                ]
              }
            }))
          }
        }
      });
    }
  }

  console.log('✅ การตรวจสอบและ Seed ข้อมูลเสร็จสมบูรณ์!');
}

main()
  .catch((e) => {
    console.error('❌ เกิดข้อผิดพลาดในการ Seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })