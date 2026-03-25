"use client";
import * as React from "react";
// Import icons: นำ ZoomIn ออก เหลือแค่ Chevron และ X
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const KAFUNG_BANNERS = [
  { 
    id: 1, 
    image: "/menu-images/promo-1get1.png", 
    title: "BUY 1 GET 1 FREE", 
    desc: "คุ้มสุดๆ! ซื้อเครื่องดื่มเมนูปั่น 1 แก้ว แถมฟรีอีก 1 แก้วทันที" 
  },
  { 
    id: 2, 
    image: "/menu-images/promo-pairing.png", 
    title: "PERFECT PAIRING", 
    desc: "จับคู่ความอร่อย! เลือกชาแก้วโปรดคู่กับขนมหวาน รับส่วนลดพิเศษ 20%" 
  },
  { 
    id: 3, 
    image: "/menu-images/promo-peachtea.png", 
    title: "PEACH TEA DUO", 
    desc: "สดชื่นคูณสอง! สั่งชาพีช 2 แก้ว ในราคาพิเศษเพียง 120.- (ปกติ 160.-)" 
  },
];

export default function PromoBanner() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  
  // --- 🔍 ส่วนจัดการการขยายรูปเต็มจอ (Image Zoom Logic) ---
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [zoomedImage, setZoomedImage] = React.useState("");

  const openZoom = (imageUrl) => {
    setZoomedImage(imageUrl);
    setIsZoomed(true);
    // ป้องกันการ Scroll หน้าเว็บหลักเมื่อเปิด Popup
    document.body.style.overflow = "hidden";
  };

  const closeZoom = () => {
    setIsZoomed(false);
    // คืนค่า Scroll หน้าเว็บหลักเมื่อปิด Popup
    document.body.style.overflow = "auto";
  };

  const next = () => setCurrentIndex((prev) => (prev + 1) % KAFUNG_BANNERS.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + KAFUNG_BANNERS.length) % KAFUNG_BANNERS.length);

  React.useEffect(() => {
    // ปิด Auto Play ถ้าเปิด Popup ขยายรูปอยู่
    if (isZoomed) return;
    
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isZoomed]);

  return (
    <section className="relative mb-12 group">
      {/* Container หลัก */}
      <div className="overflow-hidden rounded-[2.5rem] bg-coffee-dark border border-white/10 shadow-2xl relative min-h-[300px] md:min-h-[350px] flex items-center transition-all">
        
        {/* --- 🖼️ ส่วนแสดงรูปภาพและปุ่มกดขยาย (Image Area) --- */}
        <div 
          className="absolute inset-0 w-full h-full cursor-pointer transition-transform duration-700 group-hover:scale-105"
          onClick={() => openZoom(KAFUNG_BANNERS[currentIndex].image)}
        >
          <img 
            src={KAFUNG_BANNERS[currentIndex].image} 
            alt="Promo Banner" 
            className="w-full h-full object-cover object-center"
          />
          {/* Layer มืดทับรูปภาพ */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          
          {/* ✅ นำส่วนไอคอนแว่นขยาย (ZoomIn) ออกเรียบร้อยแล้วครับ ✨ */}
        </div>

        {/* --- ✍️ ส่วนข้อความ (Content) --- */}
        <div className="relative z-10 flex w-full items-center justify-between px-10 md:px-16 py-10 pointer-events-none">
          <div className="flex-1 space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-coffee-gold/20 backdrop-blur-md border border-coffee-gold/30 text-coffee-gold font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] italic pointer-events-auto">
              KAFUNG PROMOTION
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase leading-[0.9] tracking-tighter drop-shadow-lg pointer-events-auto">
              {KAFUNG_BANNERS[currentIndex].title}
            </h2>
            <p className="text-white/90 text-sm md:text-base italic font-medium max-w-[300px] md:max-w-[400px] drop-shadow-md pointer-events-auto">
              {KAFUNG_BANNERS[currentIndex].desc}
            </p>
          </div>
        </div>

        {/* --- 🕹️ ปุ่มควบคุม (Controls) --- */}
        <button 
          onClick={prev} 
          className="absolute left-5 z-20 p-3 rounded-full bg-black/20 backdrop-blur-md text-coffee-gold opacity-0 group-hover:opacity-100 transition-all hover:bg-coffee-gold hover:text-white border border-white/10 shadow-lg"
        >
          <ChevronLeft size={28} />
        </button>
        <button 
          onClick={next} 
          className="absolute right-5 z-20 p-3 rounded-full bg-black/20 backdrop-blur-md text-coffee-gold opacity-0 group-hover:opacity-100 transition-all hover:bg-coffee-gold hover:text-white border border-white/10 shadow-lg"
        >
          <ChevronRight size={28} />
        </button>

        {/* --- 📍 จุดบอกตำแหน่ง (Indicators) --- */}
        <div className="absolute bottom-8 left-10 md:left-16 flex gap-2 z-20">
          {KAFUNG_BANNERS.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === i ? "w-10 bg-coffee-gold shadow-[0_0_15px_rgba(184,124,76,0.9)]" : "w-3 bg-white/30 hover:bg-white/50"}`} 
            />
          ))}
        </div>
      </div>

      {/* --- 🔍 ส่วน Popup ขยายรูปเต็มจอ (Image Zoom Overlay) --- */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl transition-opacity duration-300 ease-out"
          onClick={closeZoom} // คลิกพื้นที่ว่างเพื่อปิด
        >
          {/* ✅ ปุ่มปิด (X) สีทองสุดพรีเมียม */}
          <button 
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-coffee-gold hover:text-white transition-all border border-white/10 shadow-2xl z-10"
            onClick={closeZoom}
          >
            <X size={32} />
          </button>

          {/* รูปภาพที่ขยายแล้ว เต็มจอ */}
          <img 
            src={zoomedImage} 
            alt="Zoomed Promo" 
            className="max-w-[95vw] max-h-[90vh] rounded-3xl object-contain shadow-[0_0_30px_rgba(184,124,76,0.3)] transition-transform duration-500 ease-out animate-zoomIn"
            onClick={(e) => e.stopPropagation()} // ป้องกันไม่ให้คลิกรูปแล้วปิด
          />
        </div>
      )}
    </section>
  );
}