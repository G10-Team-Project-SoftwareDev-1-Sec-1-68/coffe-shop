// prisma/mockData.js

const INGREDIENTS = [
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

const KAFUNG_MENU = [
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

module.exports = {
  INGREDIENTS,
  KAFUNG_MENU
};
