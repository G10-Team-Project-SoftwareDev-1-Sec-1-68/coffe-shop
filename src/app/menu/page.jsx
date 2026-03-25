"use client";
import * as React from "react";
import { Coffee, Hash, XCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import { useCartStore } from "../store/cartStore";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then(res => res.json());

function getCategoryIcon(name) {
  const n = name.toLowerCase();
  if (n.includes("coffee") || n.includes("กาแฟ") || n.includes("ร้อน")) return Coffee;
  return Hash;
}

export default function PosStyleMenuPage() {
  const { data, error, isLoading } = useSWR("/api/menu", fetcher);
  const [activeCategoryId, setActiveCategoryId] = React.useState(null);
  
  // order modal state
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [selectedVariant, setSelectedVariant] = React.useState(null);
  const [selectedOptions, setSelectedOptions] = React.useState({});
  const [quantity, setQuantity] = React.useState(1);

  const addToCart = useCartStore((state) => state.addToCart);

  // Set default category when data loads
  React.useEffect(() => {
    if (data?.categories?.length > 0 && !activeCategoryId) {
      setActiveCategoryId(data.categories[0].id);
    }
  }, [data, activeCategoryId]);

  const categories = data?.categories || [];
  const activeCategory = categories.find(c => c.id === activeCategoryId) || categories[0];

  const handleOpenModal = (product) => {
    if (!product.isAvailable) return;
    setSelectedProduct(product);
    setSelectedVariant(product.variants[0] || null);
    setSelectedOptions({});
    setQuantity(1);
  };

  const calculateTotal = () => {
    if (!selectedVariant) return 0;
    let total = selectedVariant.price;
    Object.values(selectedOptions).forEach(opt => {
      total += opt.extraPrice;
    });
    return total * quantity;
  };

  const handleConfirmOrder = () => {
    if (!selectedProduct || !selectedVariant) return;

    const optsDesc = Object.values(selectedOptions).map(o => o.name).join(', ');
    const displayString = `${selectedVariant.name}${optsDesc ? `, ${optsDesc}` : ''}`;

    const cartItem = {
      product: { 
        ...selectedProduct, 
        nameEn: selectedProduct.name, 
        image: selectedProduct.imageUrl || "/menu-images/hot-espresso.png" 
      },
      variant: selectedVariant,
      type: "ONLINE", 
    };

    addToCart(cartItem, quantity, {
      size: selectedVariant.name,
      toppings: Object.values(selectedOptions).map(o => o.name),
      totalPricePerUnit: calculateTotal() / quantity,
      displayString,
    });

    setSelectedProduct(null);
  };

  return (
    <div className="flex h-screen bg-gray-50 flex-col font-sans overflow-hidden">
      {/* Top Header */}
      <Header />

      <div className="flex flex-1 overflow-hidden mt-20 relative">
        {/* Left Sidebar - Categories */}
        <div className="w-[100px] md:w-[240px] bg-white border-r border-gray-200 flex flex-col shrink-0 z-10 overflow-y-auto shadow-sm">
          <div className="p-4 md:p-6 pb-2">
            <h2 className="text-gray-400 font-bold text-xs uppercase tracking-wider hidden md:block mb-4">Categories</h2>
          </div>
          <div className="flex flex-col gap-2 px-3 md:px-4 pb-4">
            {isLoading ? (
               [1, 2, 3, 4].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)
            ) : (
              categories.map(cat => {
                const Icon = getCategoryIcon(cat.name);
                const isActive = activeCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategoryId(cat.id)}
                    className={`flex items-center gap-3 p-3 md:p-4 rounded-xl transition-all ${
                      isActive 
                      ? "bg-amber-700 text-white shadow-md shadow-amber-900/20" 
                      : "text-gray-600 hover:bg-amber-50 hover:text-amber-900"
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="font-bold text-sm hidden md:block text-left">{cat.name}</span>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Right Content - Products */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/50 pb-32">
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="bg-white h-48 rounded-2xl border border-gray-100 animate-pulse" />)}
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-10 font-bold">Failed to load menu</div>
          ) : activeCategory?.products?.length > 0 ? (
            <>
              <h1 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                {activeCategory.name}
                <span className="text-sm font-bold bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{activeCategory.products.length}</span>
              </h1>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {activeCategory.products.map(product => (
                  <button
                    key={product.id}
                    onClick={() => handleOpenModal(product)}
                    disabled={!product.isAvailable}
                    className={`flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden text-left transition-all ${
                      product.isAvailable ? "hover:shadow-xl hover:border-amber-200 active:scale-95 cursor-pointer" : "opacity-60 cursor-not-allowed grayscale"
                    }`}
                  >
                    <div className="aspect-[4/3] w-full bg-gray-100 relative overflow-hidden">
                      {product.imageUrl ? (
                        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300"><Coffee size={40}/></div>
                      )}
                      {!product.isAvailable && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                          <span className="bg-red-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest shadow-lg transform -rotate-12">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-black text-gray-900 text-sm md:text-base leading-tight mb-1 truncate">{product.name}</h3>
                      <p className="text-xs text-gray-400 line-clamp-1 mb-3 flex-1">{product.description || "—"}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="font-black text-amber-700 text-lg flex items-baseline gap-1">
                          <span className="text-xs">฿</span>{product.variants[0]?.price || 0}
                        </span>
                        {product.isAvailable && (
                           <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
                             <span className="font-black text-lg leading-none mb-0.5">+</span>
                           </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
             <div className="text-center text-gray-400 py-20 font-bold">ไม่มีสินค้าในหมวดหมู่นี้</div>
          )}
        </div>
      </div>

      {/* POS-Style Order Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh]">
            
            {/* Left side info */}
            <div className="w-full md:w-2/5 bg-gray-50 border-r border-gray-100 p-6 flex flex-col shrink-0">
              <div className="flex justify-between md:hidden mb-4">
                 <h3 className="font-black text-gray-900">ตัวเลือกสินค้า</h3>
                 <button onClick={() => setSelectedProduct(null)} className="text-gray-400"><XCircle size={24}/></button>
              </div>
              <div className="aspect-square bg-white rounded-2xl mb-4 relative overflow-hidden shadow-sm border border-gray-100">
                {selectedProduct.imageUrl ? (
                  <Image src={selectedProduct.imageUrl} alt={selectedProduct.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300"><Coffee size={60}/></div>
                )}
              </div>
              <h2 className="text-2xl font-black text-gray-900 leading-tight mb-2">{selectedProduct.name}</h2>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed flex-1">{selectedProduct.description}</p>
              
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between mt-auto">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold hover:bg-gray-200 transition-colors">-</button>
                <span className="font-black text-2xl text-gray-900">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold hover:bg-gray-200 transition-colors">+</button>
              </div>
            </div>

            {/* Right side options */}
            <div className="w-full md:w-3/5 flex flex-col h-full max-h-[50vh] md:max-h-none overflow-hidden">
               <div className="hidden md:flex justify-end p-4 pb-0 opacity-50 hover:opacity-100">
                  <button onClick={() => setSelectedProduct(null)} className="text-gray-400 hover:text-gray-900 transition-colors"><XCircle size={28}/></button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-6 md:pt-4">
                 {/* Variants */}
                 <div className="mb-8">
                   <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-3">รูปแบบ / ขนาด</h3>
                   <div className="flex flex-col gap-2">
                     {selectedProduct.variants.map(v => (
                       <button
                         key={v.id}
                         disabled={!v.isAvailable}
                         onClick={() => setSelectedVariant(v)}
                         className={`p-3 md:p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                           !v.isAvailable ? "opacity-50 cursor-not-allowed bg-gray-50 text-gray-400 border-gray-100" :
                           selectedVariant?.id === v.id ? "border-amber-600 bg-amber-50 shadow-sm" : "border-gray-200 hover:border-amber-300"
                         }`}
                       >
                         <div>
                           <div className={`font-bold text-sm md:text-base ${selectedVariant?.id === v.id ? "text-amber-900" : "text-gray-800"}`}>{v.name}</div>
                           {!v.isAvailable && <div className="text-[10px] text-red-500 font-bold uppercase mt-1">Out of Stock</div>}
                         </div>
                         <div className={`font-black md:text-lg ${selectedVariant?.id === v.id ? "text-amber-700" : "text-gray-900"}`}>+฿{v.price}</div>
                       </button>
                     ))}
                   </div>
                 </div>

                 {/* Options */}
                 {selectedProduct.options && selectedProduct.options.length > 0 && (
                   <div>
                     <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-3">ท็อปปิ้งเพิ่มเติม</h3>
                     <div className="flex flex-col gap-2">
                       {selectedProduct.options.map(o => (
                         <button
                           key={o.id}
                           disabled={!o.isAvailable}
                           onClick={() => {
                             setSelectedOptions(prev => {
                               const next = { ...prev };
                               if (next[o.id]) delete next[o.id];
                               else next[o.id] = o;
                               return next;
                             });
                           }}
                           className={`p-3 md:p-4 rounded-xl border w-full flex justify-between items-center transition-all ${
                             !o.isAvailable ? "opacity-50 cursor-not-allowed bg-gray-50 text-gray-400 border-gray-100" :
                             selectedOptions[o.id] ? "border-amber-600 bg-amber-50 shadow-sm" : "border-gray-200 hover:border-amber-300 cursor-pointer"
                           }`}
                         >
                           <span className={`font-bold text-sm md:text-base ${selectedOptions[o.id] ? "text-amber-900" : "text-gray-700"}`}>{o.name}</span>
                           <div className="flex items-center gap-3">
                             <span className={`font-black md:text-lg ${selectedOptions[o.id] ? "text-amber-700" : "text-gray-500"}`}>
                               {Number(o.extraPrice) > 0 ? `+฿${o.extraPrice}` : "ฟรี"}
                             </span>
                             {!o.isAvailable && <span className="text-[10px] text-red-500 font-bold uppercase border border-red-200 px-2 py-0.5 rounded-full">Out of Stock</span>}
                           </div>
                         </button>
                       ))}
                     </div>
                   </div>
                 )}
               </div>

               {/* Footer / Confirm */}
               <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
                 <button
                   onClick={handleConfirmOrder}
                   disabled={!selectedVariant}
                   className="w-full py-4 rounded-2xl bg-gray-900 text-white font-bold text-lg shadow-xl shadow-gray-900/20 hover:bg-black active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-between px-8"
                 >
                   <span>เพิ่มลงตะกร้า</span>
                   <span>฿ {calculateTotal()}</span>
                 </button>
               </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}