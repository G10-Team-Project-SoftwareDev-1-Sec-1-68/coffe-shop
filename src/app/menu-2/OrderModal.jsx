"use client";
import * as React from "react";
import { X, Minus, Plus, GlassWater, Leaf, Milk, UtensilsCrossed } from "lucide-react";

export default function OrderModal({ isOpen, onClose, item, onAddToBasket }) {
  const [quantity, setQuantity] = React.useState(1);
  const [selectedSize, setSelectedSize] = React.useState('S');
  const [selectedSweetness, setSelectedSweetness] = React.useState('ปกติ');
  const [selectedMilk, setSelectedMilk] = React.useState('นมสด (ฟรี)');
  const [selectedToppings, setSelectedToppings] = React.useState([]);

  if (!isOpen || !item) return null;

  // 🟢 Logic: คำนวณราคาที่บวกเพิ่มตาม Option ที่เลือก
  const calculateTotalPrice = () => {
    let extra = 0;
    
    // เช็กขนาดแก้ว (ดึงตัวเลขจากสตริง เช่น "+10฿")
    if (selectedSize.includes('+10')) extra += 10;
    if (selectedSize.includes('+15')) extra += 15;
    
    // เช็กประเภทนม
    if (selectedMilk.includes('+10')) extra += 10;
    if (selectedMilk.includes('+15')) extra += 15;
    
    // เช็กท็อปปิ้ง (บวกตามจำนวนที่เลือกสะสมไว้)
    selectedToppings.forEach(t => {
      if (t.includes('+10')) extra += 10;
    });

    return (item.price + extra) * quantity;
  };

  const handleConfirm = () => {
    // ส่งจำนวน (Quantity) กลับไปที่หน้าหลักเพื่ออัปเดตเลขตะกร้า
    onAddToBasket(quantity);
    onClose();
    // Reset state สำหรับการเปิดครั้งหน้า
    setQuantity(1);
    setSelectedToppings([]);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-[#C49A83] w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-400 border border-white/20">
        
        {/* Header Modal */}
        <div className="bg-white px-6 py-2.5 flex justify-between items-center rounded-t-[2.5rem] border-b border-gray-100">
          <span className="text-coffee-dark font-black text-xs italic uppercase tracking-tight opacity-80">เพิ่มรายการใหม่</span>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-all text-coffee-dark">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto max-h-[80vh] no-scrollbar">
          
          {/* ส่วนหัวรายการ (Header Card): จิ๋วมินิมอลตามสั่ง */}
          <div className="bg-white rounded-[2rem] p-4 flex gap-4 items-center shadow-sm border border-white/5">
            <div className="w-[60px] h-[60px] rounded-2xl overflow-hidden bg-[#F5F5F5] flex-shrink-0 shadow-inner">
              <img src={item.image} alt={item.nameEn} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 flex flex-col justify-center overflow-hidden">
              <h3 className="text-[#4A3427] font-black text-base leading-[1.1] mb-0.5 uppercase italic tracking-tighter truncate">
                {item.nameEn || item.nameTh}
              </h3>
              <div className="flex items-baseline gap-0.5 text-[#B87C4C]">
                <span className="font-bold text-[10px] mb-[0.5px]">฿</span>
                <span className="font-black text-sm tracking-tighter leading-none">
                  {item.price}
                </span>
              </div>
            </div>

            {/* ตัวปรับจำนวน */}
            <div className="bg-[#F1F3F4] rounded-full flex items-center gap-2.5 px-2.5 py-1.5 shadow-inner">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-coffee-dark hover:opacity-50 transition-all">
                <Minus size={14} strokeWidth={3.5}/>
              </button>
              <span className="font-black text-sm min-w-[14px] text-center text-coffee-dark">
                {quantity}
              </span>
              <button onClick={() => setQuantity(q => q + 1)} className="text-coffee-dark hover:opacity-50 transition-all">
                <Plus size={14} strokeWidth={3.5}/>
              </button>
            </div>
          </div>

          {/* 2. ขนาดแก้ว (บวกราคา) */}
          <div className="bg-white rounded-[2rem] p-5 shadow-sm">
            <h4 className="text-coffee-dark font-black text-xs italic mb-4 uppercase flex items-center gap-2"><GlassWater size={14}/> ขนาดแก้ว</h4>
            <div className="grid grid-cols-3 gap-3">
              {['S', 'M +10฿', 'L +15฿'].map((size) => (
                <button 
                  key={size} 
                  onClick={() => setSelectedSize(size)} 
                  className={`py-3.5 rounded-2xl font-black italic text-xs transition-all border ${selectedSize === size ? 'bg-coffee-gold text-white border-transparent scale-105' : 'bg-white text-coffee-dark border-gray-100'}`}
                >
                  <span className="text-sm">{size.split(' ')[0]}</span>
                  {size.includes('+') && <span className="text-[8px] block opacity-80 mt-0.5">{size.split(' ')[1]}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* 3. ประเภทนม & ท็อปปิ้ง (บวกราคา) */}
          {[
            { 
              title: 'ประเภทนม', 
              icon: Milk, 
              items: ['นมสด (ฟรี)', 'นมถั่วเหลือง (+10฿)', 'นมอัลมอนด์ (+15฿)'],
              state: selectedMilk,
              setState: setSelectedMilk
            },
            { 
              title: 'ท็อปปิ้งพิเศษ', 
              icon: UtensilsCrossed, 
              items: ['เพิ่มช็อตกาแฟ (+10฿)', 'วิปปิ้งครีม (+10฿)', 'ไข่มุก (+10฿)'],
              state: selectedToppings,
              setState: (t) => setSelectedToppings(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
            }
          ].map((section, idx) => (
            <div key={idx} className="bg-white rounded-[2rem] p-5 shadow-sm border border-white/5">
              <h4 className="text-coffee-dark font-black text-xs italic mb-3 uppercase flex items-center gap-2"><section.icon size={14}/> {section.title}</h4>
              <div className="space-y-2">
                {section.items.map((opt) => {
                  const isSelected = Array.isArray(section.state) ? section.state.includes(opt) : section.state === opt;
                  return (
                    <button 
                      key={opt} 
                      onClick={() => section.setState(opt)} 
                      className={`w-full flex justify-between items-center py-2 px-4 rounded-xl transition-all border text-[10px] ${isSelected ? 'bg-coffee-gold/10 border-coffee-gold text-coffee-dark shadow-inner' : 'bg-gray-50/50 border-gray-100'}`}
                    >
                      <span className="font-bold italic">{opt.split(' (')[0]}</span>
                      <span className="font-black italic text-coffee-gold">
                        {opt.includes('ฟรี') ? 'ฟรี' : `+${opt.split(' (+')[1].replace(')', '')}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* 🟢 ปุ่มยืนยัน: แสดงราคาสุทธิที่คำนวณแล้ว */}
          <button 
            onClick={handleConfirm}
            className="w-full bg-coffee-dark text-white py-4 rounded-full font-black italic uppercase text-base shadow-xl active:scale-[0.97] transition-all mt-3"
          >
            ใส่ตะกร้า — ฿ {calculateTotalPrice()}
          </button>
        </div>
      </div>
    </div>
  );
}