const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')
const { INGREDIENTS, KAFUNG_MENU } = require('./mockData')
require('dotenv').config()

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 เริ่มต้นการตรวจสอบและ Seed ข้อมูล...')

  // ==========================================
  // 1. ตรวจสอบว่ามีข้อมูลหลักอยู่แล้วหรือไม่
  // ==========================================
  const categoryCount = await prisma.category.count();
  const ingredientCount = await prisma.ingredient.count();

  // กำลังจะ Seed ข้อมูลพื้นฐานใหม่ ถ้ายังไม่มีเลย
  const shouldSeedMenu = categoryCount === 0;
  const shouldSeedIngredients = ingredientCount === 0;

  if (!shouldSeedMenu && !shouldSeedIngredients) {
    console.log('ℹ️ พบข้อมูล Categories และ Ingredients ในระบบแล้ว จะทำการข้ามการ Seed ขนม/น้ำ เพื่อป้องกันข้อมูลออเดอร์หาย');
    console.log('💡 หากต้องการ Reset ทั้งหมด ให้ลบข้อมูลในตารางโดยตรง หรือแก้ไขไฟล์ seed.js เพื่อเปิดคำสั่ง deleteMany');
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

  // ==========================================
  // 4. สร้าง Admin User (ใช้ upsert เพื่อไม่ให้พัง)
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