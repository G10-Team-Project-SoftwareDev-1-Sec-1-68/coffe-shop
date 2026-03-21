const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 เริ่มต้นการ Seed ข้อมูล...')

  // ==========================================
  // 1. ล้างข้อมูลเก่าทิ้งก่อน (ทำจากตารางลูก -> ไปตารางแม่)
  // ==========================================
  console.log('🧹 กำลังล้างข้อมูลเก่า...')
  await prisma.inventoryTransaction.deleteMany()
  await prisma.recipe.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.pointLog.deleteMany()
  await prisma.passwordReset.deleteMany()
  await prisma.order.deleteMany()
  await prisma.productOption.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.ingredient.deleteMany()
  await prisma.promotion.deleteMany()
  await prisma.user.deleteMany()

  // ==========================================
  // 2. สร้าง User (Admin, Staff, Customer)
  // ==========================================
  console.log('👤 กำลังสร้าง Users...')
  await prisma.user.create({
    data: {
      email: 'admin@kafung.com',
      password: 'hashed_password_here', // ของจริงต้อง Hash นะครับ
      firstName: 'สมหมาย',
      lastName: 'ใจดี',
      role: 'ADMIN',
    },
  })

  await prisma.user.create({
    data: {
      email: 'staff@kafung.com',
      password: 'hashed_password_here',
      firstName: 'สมหญิง',
      lastName: 'ขยันชง',
      role: 'STAFF',
    },
  })

  // ==========================================
  // 3. สร้างวัตถุดิบ (Ingredients)
  // ==========================================
  console.log('📦 กำลังสร้างคลังวัตถุดิบ (Ingredients)...')
  const beans = await prisma.ingredient.create({
    data: { name: 'เมล็ดกาแฟ Arabica', stockQty: 5000, unit: 'g', minQty: 500, reorderQty: 1000 }
  })
  const milk = await prisma.ingredient.create({
    data: { name: 'นมสดพาสเจอร์ไรส์', stockQty: 10000, unit: 'ml', minQty: 1000, reorderQty: 2000 }
  })
  const syrup = await prisma.ingredient.create({
    data: { name: 'น้ำเชื่อม', stockQty: 2000, unit: 'ml', minQty: 200, reorderQty: 500 }
  })

  // ==========================================
  // 4. สร้างหมวดหมู่ สินค้า ตัวเลือก และสูตร (Nested Writes)
  // ==========================================
  console.log('☕ กำลังสร้างเมนูกาแฟและสูตร (BOM)...')
  await prisma.category.create({
    data: {
      name: 'Coffee',
      description: 'เมนูกาแฟสกัดสด',
      sortOrder: 1,
      products: {
        create: [
          {
            name: 'Caffe Latte (คาเฟ่ลาเต้)',
            description: 'เอสเปรสโซ่ช็อตผสมนมสด นุ่มละมุน',
            imageUrl: '/images/latte.jpg',
            // สร้าง Variants (ร้อน / เย็น) พร้อมผูกสูตร (Recipe)
            variants: {
              create: [
                {
                  name: 'Hot (ร้อน)', price: 60, sku: 'LAT-HOT',
                  recipes: { 
                    create: [
                      { ingredientId: beans.id, quantity: 18 },  // กาแฟ 18g
                      { ingredientId: milk.id, quantity: 150 }   // นม 150ml
                    ] 
                  }
                },
                {
                  name: 'Iced (เย็น)', price: 65, sku: 'LAT-ICE',
                  recipes: { 
                    create: [
                      { ingredientId: beans.id, quantity: 18 },  // กาแฟ 18g
                      { ingredientId: milk.id, quantity: 120 },  // นม 120ml
                      { ingredientId: syrup.id, quantity: 15 }   // น้ำเชื่อม 15ml
                    ] 
                  }
                }
              ]
            },
            // สร้าง Options (ตัวเลือกเสริม) พร้อมผูกสูตร
            options: {
              create: [
                { name: 'หวาน 0%', extraPrice: 0 },
                { name: 'หวาน 50%', extraPrice: 0 },
                { 
                  name: 'เพิ่มช็อต (Extra Shot)', extraPrice: 15,
                  recipes: {
                    create: [{ ingredientId: beans.id, quantity: 18 }] // ตัดกาแฟเพิ่ม 18g
                  }
                }
              ]
            }
          }
        ]
      }
    }
  })

  // ==========================================
  // 5. สร้าง Promotion ตัวอย่าง
  // ==========================================
  console.log('🎉 กำลังสร้าง Promotion...')
  await prisma.promotion.create({
    data: {
      code: 'OPENING2026',
      description: 'ฉลองเปิดร้าน ลด 10%',
      discountValue: 10,
      isPercent: true,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // หมดอายุใน 1 เดือน
      isActive: true,
    }
  })

  console.log('✅ Seed ข้อมูลเสร็จสมบูรณ์เรียบร้อยแล้ว!')
}

main()
  .catch((e) => {
    console.error('❌ เกิดข้อผิดพลาดในการ Seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })