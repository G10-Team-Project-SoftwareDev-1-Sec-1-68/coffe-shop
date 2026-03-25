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
      password: 'hashed_password_here',
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
  const generalIng = await prisma.ingredient.create({
    data: { name: 'เบสดริ้งก์ (Base)', stockQty: 999999, unit: 'g', minQty: 1000, reorderQty: 2000 }
  })
  
  const genRecipe = {
      create: [{ ingredientId: generalIng.id, quantity: 1 }]
  };

  // ==========================================
  // 4. สร้าง Categories & Products based on Friend's UI
  // ==========================================
  console.log('☕ กำลังดึงข้อมูลเมนู UI เข้าฐานข้อมูล...')
  
  const KAFUNG_DATA = [
    { cat: "ร้อน", sortArgs: 1, items: [
      { nameEn: "Hot Espresso", descTh: "เอสเพรสโซ่ร้อน เข้มข้น หอมกรุ่นต้นตำรับ", price: 65, image: "/menu-images/hot-espresso.png" },
      { nameEn: "Hot Latte", descTh: "ลาเต้ร้อน นุ่มละมุนด้วยฟองนมนวลละเอียด", price: 75, image: "/menu-images/hot-latte.png" }
    ]},
    { cat: "เย็น", sortArgs: 2, items: [
      { nameEn: "Orange Coffee", descTh: "กาแฟส้ม สดชื่นด้วยน้ำส้มแท้ตัดกับกาแฟเข้ม", price: 95, image: "/menu-images/orange-coffee.png" },
      { nameEn: "Matcha Tea", descTh: "ชาเขียวมัทฉะพรีเมียม หอมละมุน", price: 85, image: "/menu-images/iced-matcha.png" },
      { nameEn: "Thai Tea", descTh: "ชาไทยต้นตำรับ รสชาติหวานมัน เข้มข้น", price: 80, image: "/menu-images/iced-thaitea.png" },
      { nameEn: "Iced Cocoa", descTh: "โกโก้เย็นสูตรเข้มข้น สำหรับคนรักช็อกโกแลต", price: 80, image: "/menu-images/iced-cocoa.png" },
      { nameEn: "Lemon Tea", descTh: "ชามมะนาว เปรี้ยวหวานสดชื่น", price: 75, image: "/menu-images/iced-lemon.png" }
    ]},
    { cat: "ปั่น", sortArgs: 3, items: [
      { nameEn: "Pink Milk", descTh: "นมชมพูปั่น เมนูยอดฮิต หวานหอมละมุน", price: 90, image: "/menu-images/pink-milk.png" },
      { nameEn: "Taro Milk", descTh: "นมเผือกปั่น หอมเผือกแท้ๆ เนื้อเนียนนุ่ม", price: 95, image: "/menu-images/taro.png" }
    ]},
    { cat: "ขนม", sortArgs: 4, items: [
      { nameEn: "แพนเค้ก", descTh: "นุ่มฟู หอมละมุน", price: 85, image: "/menu-images/pancake.png" },
      { nameEn: "เค้กช็อกโกแลต", descTh: "เข้มข้นเต็มคำ สำหรับช็อกโกแลตเลิฟเวอร์", price: 95, image: "/menu-images/chocolate-cake.png" },
      { nameEn: "บราวนี่", descTh: "หนึบหนับ รสช็อกโกแลตเน้นๆ", price: 75, image: "/menu-images/brownie.png" },
      { nameEn: "ครอฟเฟิล", descTh: "วาฟเฟิลที่กรอบนอกนุ่มใน", price: 80, image: "/menu-images/croffle.png" },
      { nameEn: "ครัวซองต์", descTh: "หอมเนยแท้ เลเยอร์บางกรอบ", price: 70, image: "/menu-images/croissant.png" },
      { nameEn: "โดนัท", descTh: "หวานกำลังดี นุ่มละมุนลิ้น", price: 55, image: "/menu-images/donut.png" }
    ]},
    { cat: "อื่นๆ", sortArgs: 5, items: [
      { nameEn: "น้ำเปล่า", descTh: "น้ำดื่มสะอาด เย็นชื่นใจ", price: 15, image: "/menu-images/water.png" },
      { nameEn: "โซดา", descTh: "ซ่าสดชื่น เพิ่มความสดใสให้เครื่องดื่ม", price: 20, image: "/menu-images/soda.png" },
      { nameEn: "น้ำแข็ง", descTh: "น้ำแข็งสะอาด เกรดพรีเมียม", price: 5, image: "/menu-images/ice.png" }
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
                   name: "Default Size (S)", 
                   price: it.price, 
                   sku: `SKU-${c.sortArgs}-${idx}`, 
                   recipes: genRecipe 
                 },
                 { 
                   name: "Size (L)", 
                   price: it.price + 15, 
                   sku: `SKU-${c.sortArgs}-${idx}-L`, 
                   recipes: genRecipe 
                 }
               ]
            },
            options: {
              create: [
                 { name: "ความหวาน 0%", extraPrice: 0, recipes: genRecipe },
                 { name: "ความหวาน 50%", extraPrice: 0, recipes: genRecipe },
                 { name: "ความหวาน 100%", extraPrice: 0, recipes: genRecipe },
                 { name: "ไข่มุก", extraPrice: 10, recipes: genRecipe },
                 { name: "เพิ่มช็อต", extraPrice: 15, recipes: genRecipe }
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