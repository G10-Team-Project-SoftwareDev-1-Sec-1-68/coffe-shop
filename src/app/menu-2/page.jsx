"use client";
import * as React from "react";
import { 
  Coffee, 
  CupSoda, 
  Snowflake, 
  CakeSlice, 
  Candy, 
  Home, 
  UserCircle,
  ClipboardList // 🟢 นำไอคอนคำสั่งซื้อกลับมา
} from "lucide-react";
import Link from "next/link"; 
import Header from "../components/Header"; 
import MenuCard from "./MenuCard"; 
import PromoBanner from "./PromoBanner"; 
import OrderModal from "./OrderModal";

const KAFUNG_DATA = [
  // --- ร้อน (hot) ---
  { id: 1, nameEn: "Hot Espresso", descTh: "เอสเพรสโซ่ร้อน เข้มข้น หอมกรุ่นต้นตำรับ", price: 65, type: "hot", image: "/menu-images/hot-espresso.png" },
  { id: 2, nameEn: "Hot Latte", descTh: "ลาเต้ร้อน นุ่มละมุนด้วยฟองนมนวลละเอียด", price: 75, type: "hot", image: "/menu-images/hot-latte.png" },
  
  // --- เย็น (iced) ---
  { id: 3, nameEn: "Orange Coffee", descTh: "กาแฟส้ม สดชื่นด้วยน้ำส้มแท้ตัดกับกาแฟเข้ม", price: 95, type: "iced", image: "/menu-images/orange-coffee.png" },
  { id: 4, nameEn: "Matcha Tea", descTh: "ชาเขียวมัทฉะพรีเมียม หอมละมุน", price: 85, type: "iced", image: "/menu-images/iced-matcha.png" },
  { id: 5, nameEn: "Thai Tea", descTh: "ชาไทยต้นตำรับ รสชาติหวานมัน เข้มข้น", price: 80, type: "iced", image: "/menu-images/iced-thaitea.png" },
  { id: 6, nameEn: "Iced Cocoa", descTh: "โกโก้เย็นสูตรเข้มข้น สำหรับคนรักช็อกโกแลต", price: 80, type: "iced", image: "/menu-images/iced-cocoa.png" },
  { id: 7, nameEn: "Lemon Tea", descTh: "ชามมะนาว เปรี้ยวหวานสดชื่น", price: 75, type: "iced", image: "/menu-images/iced-lemon.png" },
  
  // --- ปั่น (frappe) ---
  { id: 10, nameEn: "Pink Milk", descTh: "นมชมพูปั่น เมนูยอดฮิต หวานหอมละมุน", price: 90, type: "frappe", image: "/menu-images/pink-milk.png" },
  { id: 11, nameEn: "Taro Milk", descTh: "นมเผือกปั่น หอมเผือกแท้ๆ เนื้อเนียนนุ่ม", price: 95, type: "frappe", image: "/menu-images/taro.png" },
  
  // --- ขนม (bakery) ---
  { id: 101, nameTh: "แพนเค้ก", descTh: "นุ่มฟู หอมละมุน", price: 85, type: "bakery", image: "/menu-images/pancake.png" },
  { id: 102, nameTh: "เค้กช็อกโกแลต", descTh: "เข้มข้นเต็มคำ สำหรับช็อกโกแลตเลิฟเวอร์", price: 95, type: "bakery", image: "/menu-images/chocolate-cake.png" },
  { id: 103, nameTh: "บราวนี่", descTh: "หนึบหนับ รสช็อกโกแลตเน้นๆ", price: 75, type: "bakery", image: "/menu-images/brownie.png" },
  { id: 104, nameTh: "ครอฟเฟิล", descTh: "วาฟเฟิลที่กรอบนอกนุ่มใน", price: 80, type: "bakery", image: "/menu-images/croffle.png" },
  { id: 105, nameTh: "ครัวซองต์", descTh: "หอมเนยแท้ เลเยอร์บางกรอบ", price: 70, type: "bakery", image: "/menu-images/croissant.png" },
  { id: 106, nameTh: "โดนัท", descTh: "หวานกำลังดี นุ่มละมุนลิ้น", price: 55, type: "bakery", image: "/menu-images/donut.png" },
  
  // --- อื่นๆ (others) ---
  { id: 201, nameTh: "น้ำเปล่า", descTh: "น้ำดื่มสะอาด เย็นชื่นใจ", price: 15, type: "others", image: "/menu-images/water.png" },
  { id: 202, nameTh: "โซดา", descTh: "ซ่าสดชื่น เพิ่มความสดใสให้เครื่องดื่ม", price: 20, type: "others", image: "/menu-images/soda.png" },
  { id: 203, nameTh: "น้ำแข็ง", descTh: "น้ำแข็งสะอาด เกรดพรีเมียม", price: 5, type: "others", image: "/menu-images/ice.png" },
];

function CategoryTab({ label, icon: Icon, active, onClick }) {
  return (
    <button 
      onClick={onClick} 
      className={`flex flex-col items-center justify-center gap-1.5 min-w-[100px] h-[100px] rounded-3xl transition-all ${
        active 
        ? "bg-coffee-gold text-white shadow-lg scale-105" 
        : "bg-white text-coffee-dark/60 border border-gray-100"
      }`}
    >
      <Icon size={28} strokeWidth={2.5} />
      <span className="text-xs font-black uppercase italic tracking-tight">{label}</span>
    </button>
  );
}

export default function KafungMenuPage() {
  const [activeTab, setActiveTab] = React.useState("hot");
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [basketCount, setBasketCount] = React.useState(0);

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAddToBasket = (quantity) => {
    setBasketCount(prev => prev + quantity);
  };

  const filteredData = KAFUNG_DATA.filter(item => item.type === activeTab);

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-40 relative">
      {/* 🟢 ส่งเลขตะกร้าไปที่ Header */}
      <Header basketCount={basketCount} />
      
      <main className="max-w-[1200px] mx-auto pt-32 px-6">
        <div className="mb-8">
          <PromoBanner />
        </div>

        <div className="flex justify-start md:justify-center gap-4 mb-8 overflow-x-auto py-4 no-scrollbar">
          <CategoryTab label="ร้อน" icon={Coffee} active={activeTab === "hot"} onClick={() => setActiveTab("hot")} />
          <CategoryTab label="เย็น" icon={CupSoda} active={activeTab === "iced"} onClick={() => setActiveTab("iced")} />
          <CategoryTab label="ปั่น" icon={Snowflake} active={activeTab === "frappe"} onClick={() => setActiveTab("frappe")} />
          <CategoryTab label="ขนม" icon={CakeSlice} active={activeTab === "bakery"} onClick={() => setActiveTab("bakery")} />
          <CategoryTab label="อื่นๆ" icon={Candy} active={activeTab === "others"} onClick={() => setActiveTab("others")} />
        </div>

        <div className="space-y-1 pb-32">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <MenuCard key={item.id} item={item} onClick={() => handleOpenModal(item)} />
            ))
          ) : (
            <div className="text-center py-20 text-lg text-muted-foreground italic font-bold">ยังไม่มีเมนูหมวดนี้ค่ะ</div>
          )}
        </div>
      </main>

      {/* --- 🧭 Floating Bottom Nav (กู้ชีพไอคอนคำสั่งซื้อ) --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xl z-50 px-4">
        <div className="bg-coffee-dark/95 backdrop-blur-xl h-20 rounded-[2.5rem] shadow-2xl flex items-center justify-around px-10 border border-white/10 text-white relative">
          
          {/* หน้าหลัก */}
          <button className="flex flex-col items-center gap-1 text-coffee-gold transition-all">
            <Home size={28} strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase italic tracking-tighter">หน้าหลัก</span>
          </button>

          {/* 🟢 ไอคอนคำสั่งซื้อ (ClipboardList) กลับมาแล้วครับ */}
          <Link href="/orders" className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-all">
            <ClipboardList size={28} strokeWidth={2} />
            <span className="text-[10px] font-bold uppercase italic tracking-tighter">คำสั่งซื้อ</span>
          </Link>

          {/* โปรไฟล์ */}
          <Link href="/profile" className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-all">
            <UserCircle size={28} strokeWidth={2} />
            <span className="text-[10px] font-bold uppercase italic tracking-tighter">โปรไฟล์</span>
          </Link>
        </div>
      </div>

      <OrderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        item={selectedItem} 
        onAddToBasket={handleAddToBasket}
      />

      <style jsx global>{`
        * { font-family: 'Playpen Sans', cursive !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}