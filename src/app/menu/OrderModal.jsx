"use client";
import * as React from "react";
import { X, Minus, Plus, GlassWater, Milk, UtensilsCrossed, Droplets } from "lucide-react";
import { useCartStore } from "../store/cartStore";

export default function OrderModal({ isOpen, onClose, item, onAddToBasket }) {
  const [quantity, setQuantity] = React.useState(1);
  const [selectedSize, setSelectedSize] = React.useState('S');
  const [selectedSweetness, setSelectedSweetness] = React.useState('ปกติ');
  const [selectedMilk, setSelectedMilk] = React.useState('นมสด (ฟรี)');
  const [selectedToppings, setSelectedToppings] = React.useState([]);
  const addToCart = useCartStore((state) => state.addToCart);

  if (!isOpen || !item) return null;

  const calculateTotalPrice = () => {
    let extra = 0;
    if (selectedSize.includes('+10')) extra += 10;
    if (selectedSize.includes('+15')) extra += 15;
    if (selectedMilk.includes('+10')) extra += 10;
    if (selectedMilk.includes('+15')) extra += 15;
    selectedToppings.forEach(t => { if (t.includes('+10')) extra += 10; });
    return (item.price + extra) * quantity;
  };

  const handleConfirm = () => {
    const displayOptions = `${selectedSize.split(' ')[0]}, ${selectedSweetness}, ${selectedMilk.split(' ')[0]}${selectedToppings.length > 0 ? ', ' + selectedToppings.map(t => t.split(' ')[0]).join(', ') : ''}`;
    
    addToCart(item, quantity, {
      size: selectedSize,
      sweetness: selectedSweetness,
      milk: selectedMilk,
      toppings: selectedToppings,
      totalPricePerUnit: calculateTotalPrice() / quantity,
      displayString: displayOptions
    });

    onAddToBasket(quantity);
    onClose();
    setQuantity(1);
    setSelectedToppings([]);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-[#C49A83] w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-400 border border-white/20">
        
        {/* Header Modal */}
        <div className="bg-white px-6 py-3 flex justify-between items-center border-b border-gray-100">
          <span className="text-[#4A3427] font-black text-xs italic uppercase tracking-tight opacity-80">เพิ่มรายการใหม่</span>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-[#4A3427]">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto max-h-[75vh] no-scrollbar">
          
          {/* 1. ส่วนหัวรายการ (Header Card) */}
          <div className="bg-white rounded-[2rem] p-4 flex gap-4 items-center shadow-sm">
            <div className="w-[60px] h-[60px] rounded-2xl overflow-hidden bg-[#F5F5F5] flex-shrink-0 shadow-inner">
              <img src={item.image} alt={item.nameEn} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-[#4A3427] font-black text-base leading-tight uppercase italic tracking-tighter truncate">
                {item.nameEn || item.nameTh}
              </h3>
              <div className="flex items-baseline gap-0.5 text-[#B87C4C]">
                <span className="font-bold text-[10px]">฿</span>
                <span className="font-black text-sm leading-none">{item.price}</span>
              </div>
            </div>
            <div className="bg-[#F1F3F4] rounded-full flex items-center gap-2.5 px-2.5 py-1.5 shadow-inner border border-gray-200/50">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-[#4A3427]"><Minus size={14} strokeWidth={3.5}/></button>
              <span className="font-black text-sm min-w-[14px] text-center">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="text-[#4A3427]"><Plus size={14} strokeWidth={3.5}/></button>
            </div>
          </div>

          {/* 2. ขนาดแก้ว */}
          <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-white/5">
            <h4 className="text-coffee-dark font-black text-[11px] italic mb-4 uppercase flex items-center gap-2"><GlassWater size={14}/> ขนาดแก้ว</h4>
            <div className="grid grid-cols-3 gap-3">
              {['S', 'M +10฿', 'L +15฿'].map((size) => (
                <button key={size} onClick={() => setSelectedSize(size)} className={`py-3 rounded-2xl font-black italic text-xs border transition-all ${selectedSize === size ? 'bg-coffee-gold text-white border-transparent' : 'bg-white text-coffee-dark border-gray-100'}`}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* 🟢 ส่วนที่เหลือที่หายไป: ระดับความหวาน */}
          <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-white/5">
            <h4 className="text-coffee-dark font-black text-[11px] italic mb-4 uppercase flex items-center gap-2"><Droplets size={14}/> ระดับความหวาน</h4>
            <div className="grid grid-cols-4 gap-2">
              {['0%', '25%', '50%', '100%'].map((level) => (
                <button key={level} onClick={() => setSelectedSweetness(level)} className={`py-2.5 rounded-xl font-black italic text-[10px] border transition-all ${selectedSweetness === level ? 'bg-coffee-gold text-white border-transparent' : 'bg-gray-50 text-coffee-dark border-gray-100'}`}>
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* 🟢 ส่วนที่เหลือที่หายไป: ประเภทนม & ท็อปปิ้ง */}
          {[
            { title: 'ประเภทนม', icon: Milk, items: ['นมสด (ฟรี)', 'นมถั่วเหลือง (+10฿)', 'นมอัลมอนด์ (+15฿)'], state: selectedMilk, setState: setSelectedMilk },
            { title: 'ท็อปปิ้งพิเศษ', icon: UtensilsCrossed, items: ['เพิ่มช็อตกาแฟ (+10฿)', 'วิปปิ้งครีม (+10฿)', 'ไข่มุก (+10฿)'], state: selectedToppings, setState: (t) => setSelectedToppings(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]) }
          ].map((section, idx) => (
            <div key={idx} className="bg-white rounded-[2rem] p-5 shadow-sm border border-white/5">
              <h4 className="text-coffee-dark font-black text-[11px] italic mb-3 uppercase flex items-center gap-2"><section.icon size={14}/> {section.title}</h4>
              <div className="space-y-2">
                {section.items.map((opt) => {
                  const isSelected = Array.isArray(section.state) ? section.state.includes(opt) : section.state === opt;
                  return (
                    <button key={opt} onClick={() => section.setState(opt)} className={`w-full flex justify-between items-center py-2.5 px-4 rounded-xl transition-all border text-[10px] ${isSelected ? 'bg-coffee-gold/10 border-coffee-gold text-coffee-dark' : 'bg-gray-50/50 border-gray-100'}`}>
                      <span className="font-bold italic">{opt.split(' (')[0]}</span>
                      <span className="font-black italic text-coffee-gold">{opt.includes('ฟรี') ? 'ฟรี' : `+${opt.split(' (+')[1].replace(')', '')}`}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* ปุ่มยืนยัน */}
          <button onClick={handleConfirm} className="w-full bg-[#332C26] text-white py-4.5 rounded-full font-black italic uppercase text-lg shadow-xl active:scale-[0.97] transition-all mt-2 border border-white/5">
            ใส่ตะกร้า — ฿ {calculateTotalPrice()}
          </button>
        </div>
      </div>
    </div>
  );
}