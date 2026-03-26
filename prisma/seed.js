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
  // 1. ล้างข้อมูลเก่าทิ้งก่อน (ตารางลูก -> ตารางแม่)
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
  // 2. สร้าง User
  // ==========================================
  console.log('👤 กำลังสร้าง Users...')
  await prisma.user.create({
    data: {
      email: 'admin@kafung.com',
      password: 'hashed_password_here',
      firstName: 'สมหมาย',
      lastName: 'ใจดี',
      role: 'ADMIN',
    },
  })

  // ==========================================
  // 3. สร้างวัตถุดิบจริง (Ingredients)
  // ==========================================
  console.log('📦 กำลังสร้างคลังวัตถุดิบจริง (Ingredients)...')
  
  const ingData = [
    { name: 'เมล็ดกาแฟ (Coffee Beans)', stockQty: 5000, unit: 'g', minQty: 500 },
    { name: 'นมสด (Fresh Milk)', stockQty: 10000, unit: 'ml', minQty: 1000 },
    { name: 'ผงมัทฉะ (Matcha Powder)', stockQty: 1000, unit: 'g', minQty: 100 },
    { name: 'ผงโกโก้ (Cocoa Powder)', stockQty: 2000, unit: 'g', minQty: 200 },
    { name: 'ชาไทย (Thai Tea Leaf)', stockQty: 2000, unit: 'g', minQty: 200 },
    { name: 'น้ำเชื่อม (Syrup)', stockQty: 5000, unit: 'ml', minQty: 500 },
    { name: 'ผงนมเผือก (Taro Powder)', stockQty: 1000, unit: 'g', minQty: 100 },
    { name: 'น้ำส้มแท้ (Orange Juice)', stockQty: 3000, unit: 'ml', minQty: 300 },
    { name: 'น้ำแดง (Red Syrup)', stockQty: 2000, unit: 'ml', minQty: 200 },
    { name: 'น้ำมะนาว (Lemon Juice)', stockQty: 1000, unit: 'ml', minQty: 100 },
    { name: 'แป้งแพนเค้ก (Pancake Mix)', stockQty: 5000, unit: 'g', minQty: 500 },
    { name: 'ช็อกโกแลตเข้มข้น (Choco Melt)', stockQty: 2000, unit: 'g', minQty: 200 },
    { name: 'ครอฟเฟิลโด (Croffle Dough)', stockQty: 50, unit: 'pcs', minQty: 10 },
    { name: 'ครัวซองต์โด (Croissant Dough)', stockQty: 50, unit: 'pcs', minQty: 10 },
    { name: 'โดนัท (Donut Base)', stockQty: 40, unit: 'pcs', minQty: 10 },
    { name: 'น้ำเปล่า (Water)', stockQty: 100, unit: 'bottles', minQty: 10 },
    { name: 'โซดา (Soda)', stockQty: 50, unit: 'bottles', minQty: 10 },
    { name: 'น้ำแข็ง (Ice)', stockQty: 50000, unit: 'g', minQty: 5000 },
    { name: 'ไข่มึก (Pearls)', stockQty: 3000, unit: 'g', minQty: 300 }
  ];

  const ings = {};
  for (const item of ingData) {
    const created = await prisma.ingredient.create({ data: item });
    ings[item.name] = created.id;
  }

  // ==========================================
  // 4. สร้าง Categories & Products with REAL Recipes
  // ==========================================
  console.log('☕ กำลังแมปสูตร (Recipes) เข้าเมนู...')
  
  const KAFUNG_DATA = [
    { cat: "ร้อน", sortArgs: 1, items: [
      { nameEn: "Hot Espresso", descTh: "เอสเพรสโซ่ร้อน เข้มข้น", price: 65, image: "/menu-images/hot-espresso.png", 
        recipe: [{ ing: 'เมล็ดกาแฟ (Coffee Beans)', qty: 18 }] },
      { nameEn: "Hot Latte", descTh: "ลาเต้ร้อน นุ่มละมุน", price: 75, image: "/menu-images/hot-latte.png",
        recipe: [{ ing: 'เมล็ดกาแฟ (Coffee Beans)', qty: 18 }, { ing: 'นมสด (Fresh Milk)', qty: 150 }] }
    ]},
    { cat: "เย็น", sortArgs: 2, items: [
      { nameEn: "Orange Coffee", descTh: "กาแฟส้ม สดชื่น", price: 95, image: "/menu-images/orange-coffee.png",
        recipe: [{ ing: 'เมล็ดกาแฟ (Coffee Beans)', qty: 18 }, { ing: 'น้ำส้มแท้ (Orange Juice)', qty: 100 }, { ing: 'น้ำแข็ง (Ice)', qty: 200 }] },
      { nameEn: "Matcha Tea", descTh: "ชาเขียวมัทฉะพรีเมียม", price: 85, image: "/menu-images/iced-matcha.png",
        recipe: [{ ing: 'ผงมัทฉะ (Matcha Powder)', qty: 10 }, { ing: 'นมสด (Fresh Milk)', qty: 150 }, { ing: 'น้ำแข็ง (Ice)', qty: 200 }] },
      { nameEn: "Thai Tea", descTh: "ชาไทยต้นตำรับ", price: 80, image: "/menu-images/iced-thaitea.png",
        recipe: [{ ing: 'ชาไทย (Thai Tea Leaf)', qty: 15 }, { ing: 'นมสด (Fresh Milk)', qty: 150 }, { ing: 'น้ำแข็ง (Ice)', qty: 200 }] },
      { nameEn: "Iced Cocoa", descTh: "โกโก้เย็นสูตรเข้มข้น", price: 80, image: "/menu-images/iced-cocoa.png",
        recipe: [{ ing: 'ผงโกโก้ (Cocoa Powder)', qty: 15 }, { ing: 'นมสด (Fresh Milk)', qty: 150 }, { ing: 'น้ำแข็ง (Ice)', qty: 200 }] },
      { nameEn: "Lemon Tea", descTh: "ชามมะนาว เปรี้ยวหวาน", price: 75, image: "/menu-images/iced-lemon.png",
        recipe: [{ ing: 'ชาไทย (Thai Tea Leaf)', qty: 15 }, { ing: 'น้ำมะนาว (Lemon Juice)', qty: 30 }, { ing: 'น้ำแข็ง (Ice)', qty: 200 }] }
    ]},
    { cat: "ปั่น", sortArgs: 3, items: [
      { nameEn: "Pink Milk", descTh: "นมชมพูปั่น", price: 90, image: "/menu-images/pink-milk.png",
        recipe: [{ ing: 'น้ำแดง (Red Syrup)', qty: 30 }, { ing: 'นมสด (Fresh Milk)', qty: 150 }, { ing: 'น้ำแข็ง (Ice)', qty: 300 }] },
      { nameEn: "Taro Milk", descTh: "นมเผือกปั่น", price: 95, image: "/menu-images/taro.png",
        recipe: [{ ing: 'ผงนมเผือก (Taro Powder)', qty: 20 }, { ing: 'นมสด (Fresh Milk)', qty: 150 }, { ing: 'น้ำแข็ง (Ice)', qty: 300 }] }
    ]},
    { cat: "ขนม", sortArgs: 4, items: [
      { nameEn: "แพนเค้ก", descTh: "นุ่มฟู หอมละมุน", price: 85, image: "/menu-images/pancake.png",
        recipe: [{ ing: 'แป้งแพนเค้ก (Pancake Mix)', qty: 100 }] },
      { nameEn: "ครอฟเฟิล", descTh: "กรอบนอกนุ่มใน", price: 80, image: "/menu-images/croffle.png",
        recipe: [{ ing: 'ครอฟเฟิลโด (Croffle Dough)', qty: 1 }] },
      { nameEn: "ครัวซองต์", descTh: "หอมเนยแท้", price: 70, image: "/menu-images/croissant.png",
        recipe: [{ ing: 'ครัวซองต์โด (Croissant Dough)', qty: 1 }] }
    ]},
    { cat: "อื่นๆ", sortArgs: 5, items: [
      { nameEn: "น้ำเปล่า", descTh: "น้ำดื่มสะอาด", price: 15, image: "/menu-images/water.png",
        recipe: [{ ing: 'น้ำเปล่า (Water)', qty: 1 }] },
      { nameEn: "โซดา", descTh: "ซ่าสดชื่น", price: 20, image: "/menu-images/soda.png",
        recipe: [{ ing: 'โซดา (Soda)', qty: 1 }] }
    ]}
  ];

  for (const c of KAFUNG_DATA) {
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
                       ingredientId: ings[r.ing],
                       quantity: r.qty
                     }))
                   }
                 }
               ]
            },
            options: {
              create: [
                 { name: "เพิ่มไข่มุก", extraPrice: 10, recipes: { create: [{ ingredientId: ings['ไข่มึก (Pearls)'], quantity: 50 }] } },
                 { name: "เพิ่มช็อต", extraPrice: 15, recipes: { create: [{ ingredientId: ings['เมล็ดกาแฟ (Coffee Beans)'], quantity: 18 }] } }
              ]
            }
          }))
        }
      }
    });
  }

  // ==========================================
  // 5. สร้าง Promotion
  // ==========================================
  console.log('🎉 กำลังสร้าง Promotion...')
  await prisma.promotion.create({
    data: {
      code: 'OPENING2026',
      description: 'ฉลองเปิดร้าน ลด 10%',
      discountValue: 10,
      isPercent: true,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
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