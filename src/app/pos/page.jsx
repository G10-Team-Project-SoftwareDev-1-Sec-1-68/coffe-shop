"use client";

import { useState, useRef } from "react";
import Header from "@/app/components/Header";

// ================= MENU =================
const MENU = [
  { id: 1, name: "Espresso",     price: 60,  tags: ["HOT"],        emoji: "☕", category: "Coffee" },
  { id: 2, name: "Americano",    price: 65,  tags: ["HOT", "ICE"], emoji: "🖤", category: "Coffee" },
  { id: 3, name: "Latte",        price: 75,  tags: ["HOT", "ICE"], emoji: "🥛", category: "Coffee" },
  { id: 4, name: "Cappuccino",   price: 75,  tags: ["HOT"],        emoji: "☁️", category: "Coffee" },
  { id: 5, name: "Cold Brew",    price: 80,  tags: ["ICE"],        emoji: "🧊", category: "Coffee" },
  { id: 6, name: "Matcha Latte", price: 85,  tags: ["HOT", "ICE"], emoji: "🍵", category: "Non-Coffee" },
  { id: 7, name: "Mocha",        price: 80,  tags: ["HOT", "ICE"], emoji: "🍫", category: "Coffee" },
  { id: 8, name: "Thai Tea",     price: 70,  tags: ["ICE"],        emoji: "🧡", category: "Non-Coffee" },
  { id: 9, name: "Cocoa",        price: 70,  tags: ["HOT", "ICE"], emoji: "🍫", category: "Non-Coffee" },
  { id: 10, name: "Lemonade",    price: 65,  tags: ["ICE"],        emoji: "🍋", category: "Non-Coffee" },
];

const CATEGORIES = ["All", "Coffee", "Non-Coffee"];

// Options สำหรับเลือกเพิ่มเติม
const PRODUCT_OPTIONS = {
  SWEETNESS: {
    name: "ระดับความหวาน",
    values: [
      { label: "ไม่หวาน (0%)", value: 0, price: 0 },
      { label: "น้อยหวาน (25%)", value: 25, price: 0 },
      { label: "ปกติ (50%)", value: 50, price: 0 },
      { label: "หวาน (75%)", value: 75, price: 0 },
      { label: "หวานมาก (100%)", value: 100, price: 0 },
    ],
  },
  EXTRA_SHOT: {
    name: "ช็อตกาแฟ",
    values: [
      { label: "1 ช็อต", value: 1, price: 0 },
      { label: "2 ช็อต (เพิ่ม 10฿)", value: 2, price: 10 },
      { label: "3 ช็อต (เพิ่ม 20฿)", value: 3, price: 20 },
    ],
  },
  TOPPING: {
    name: "ท็อปปิ้ง",
    values: [
      { label: "ไม่เพิ่ม", value: "none", price: 0 },
      { label: "พาร์ลี (เพิ่ม 15฿)", value: "pearl", price: 15 },
      { label: "วิปครีม (เพิ่ม 10฿)", value: "whip", price: 10 },
    ],
  },
};

function formatTime(date) {
  return date.toLocaleString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Helper: ได้ label จาก value
const getOptionLabel = (optionKey, value) => {
  const option = PRODUCT_OPTIONS[optionKey];
  if (!option) return value;
  const found = option.values.find(o => o.value === value);
  return found?.label || value;
};

let orderCounter = 1;

export default function POSPage() {
  const [cart, setCart] = useState({});
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [tempType, setTempType] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const printRef = useRef(null);

  const addToCart = (item, temp) => {
    // บันทึกรายการและเปิด modal เพื่อเลือก options
    setSelectedItem(item);
    setTempType(temp);
    setSelectedOptions({
      sweetness: 50,
      extraShot: 1,
      topping: "none",
    });
  };

  const confirmAddToCart = () => {
    if (!selectedItem || !tempType) return;

    // Safety check: ensure options have valid values
    const safeOptions = {
      sweetness: selectedOptions.sweetness ?? 50,
      extraShot: selectedOptions.extraShot ?? 1,
      topping: selectedOptions.topping ?? "none",
    };

    const optionsExtra = 
      (PRODUCT_OPTIONS.EXTRA_SHOT.values.find(o => o.value === safeOptions.extraShot)?.price || 0) +
      (PRODUCT_OPTIONS.TOPPING.values.find(o => o.value === safeOptions.topping)?.price || 0);

    const key = `${selectedItem.id}_${tempType}_${safeOptions.sweetness}_${safeOptions.extraShot}_${safeOptions.topping}`;
    
    setCart((prev) => ({
      ...prev,
      [key]: {
        ...selectedItem,
        temp: tempType,
        options: safeOptions,
        optionsExtra,
        qty: (prev[key]?.qty || 0) + 1,
      },
    }));

    // Show success message
    setSuccessMsg(`✅ ${selectedItem.name} เพิ่มลงตะกร้าแล้ว!`);
    setTimeout(() => setSuccessMsg(""), 2000);

    setSelectedItem(null);
    setTempType("");
  };

  const changeQty = (key, delta) => {
    setCart((prev) => {
      const next = { ...prev };
      const newQty = (next[key]?.qty || 0) + delta;
      if (newQty <= 0) delete next[key];
      else next[key].qty = newQty;
      return next;
    });
  };

  const clearCart = () => {
    setCart({});
    setNote("");
    setError("");
  };

  const cartItems = Object.entries(cart).map(([key, val]) => ({
    key,
    ...val,
  }));

  const total = cartItems.reduce((sum, i) => sum + (i.price + (i.optionsExtra || 0)) * i.qty, 0);

  const filteredMenu =
    category === "All"
      ? MENU
      : MENU.filter((m) => m.category === category);

  const handleCheckout = async () => {
    if (!cartItems || cartItems.length === 0) return;

    setLoading(true);
    setError("");

    // Recalculate total to be safe
    const safeTotal = cartItems.reduce((sum, i) => {
      const itemPrice = Number(i.price) || 0;
      const itemExtra = Number(i.optionsExtra) || 0;
      const itemQty = Number(i.qty) || 1;
      return sum + (itemPrice + itemExtra) * itemQty;
    }, 0);

    const orderData = {
      orderId: `ORD-${String(orderCounter).padStart(4, "0")}`,
      items: cartItems.map(item => ({
        ...item,
        qty: Number(item.qty) || 1,
        price: Number(item.price) || 0,
        optionsExtra: Number(item.optionsExtra) || 0,
      })),
      note,
      total: safeTotal,
      createdAt: new Date(),
    };

    try {
      await new Promise((r) => setTimeout(r, 600)); // simulate API
      orderCounter++;
      setReceipt(orderData);
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const content = printRef.current;
    const win = window.open("", "_blank", "width=400,height=600");

    win.document.write(`
      <html>
        <head>
          <title>Receipt</title>
        </head>
        <body style="font-family: monospace; padding:20px;">
          ${content.innerHTML}
        </body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  const handleCloseReceipt = () => {
    setReceipt(null);
    clearCart();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Success Notification */}
      {successMsg && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-40 animate-pulse">
          {successMsg}
        </div>
      )}

      {/* Options Selection Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg max-h-96 overflow-auto">
            <h2 className="text-2xl font-bold mb-2">
              {selectedItem.emoji} {selectedItem.name} ({tempType})
            </h2>
            <p className="text-coffee-dark font-bold text-lg mb-4">฿{selectedItem.price}</p>

            <div className="space-y-4 mb-6">
              {/* Sweetness */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  {PRODUCT_OPTIONS.SWEETNESS.name}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {PRODUCT_OPTIONS.SWEETNESS.values.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() =>
                        setSelectedOptions((prev) => ({
                          ...prev,
                          sweetness: opt.value,
                        }))
                      }
                      className={`p-2 text-sm rounded transition ${
                        selectedOptions.sweetness === opt.value
                          ? "bg-coffee-dark text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Extra Shot */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  {PRODUCT_OPTIONS.EXTRA_SHOT.name}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {PRODUCT_OPTIONS.EXTRA_SHOT.values.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() =>
                        setSelectedOptions((prev) => ({
                          ...prev,
                          extraShot: opt.value,
                        }))
                      }
                      className={`p-2 text-sm rounded transition ${
                        selectedOptions.extraShot === opt.value
                          ? "bg-coffee-dark text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topping */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  {PRODUCT_OPTIONS.TOPPING.name}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {PRODUCT_OPTIONS.TOPPING.values.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() =>
                        setSelectedOptions((prev) => ({
                          ...prev,
                          topping: opt.value,
                        }))
                      }
                      className={`p-2 text-sm rounded transition ${
                        selectedOptions.topping === opt.value
                          ? "bg-coffee-dark text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmAddToCart}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 font-semibold"
              >
                เพิ่มลงตะกร้า
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {receipt && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <div ref={printRef} className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">☕ KAFUNG</h2>
              <p className="text-sm text-gray-600">{formatTime(receipt.createdAt)}</p>
              <p className="text-lg font-semibold text-coffee-dark">{receipt.orderId}</p>
              
              <div className="border-t border-b my-4 py-4 text-left text-sm">
                {receipt.items.map((item, i) => (
                  <div key={i} className="mb-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">{item.name} ({item.temp}) x{item.qty}</span>
                      <span>฿{(item.price + (item.optionsExtra || 0)) * item.qty}</span>
                    </div>
                    {item.options && (
                      <div className="text-xs text-gray-600 ml-2">
                        • เหลือ {item.options.sweetness}%
                        {item.options.extraShot > 1 && ` • ${item.options.extraShot} ช็อต`}
                        {item.options.topping !== "none" && ` • ${getOptionLabel("TOPPING", item.options.topping)}`}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-right">
                <p className="text-xl font-bold text-coffee-dark">รวม: ฿{receipt.total}</p>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button 
                onClick={handleCloseReceipt}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                ปิด
              </button>
              <button 
                onClick={handlePrint}
                className="px-4 py-2 rounded bg-coffee-dark text-white hover:bg-opacity-80"
              >
                พิมพ์
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-screen">
        {/* Left: Menu */}
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-coffee-dark mb-4">☕ POS Menu</h1>
            
            {/* Category Buttons */}
            <div className="flex gap-2 mb-6">
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat} 
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded font-medium transition ${
                    category === cat
                      ? "bg-coffee-dark text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-2 gap-4">
            {filteredMenu.map((item) => (
              <div 
                key={item.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition border border-gray-200"
              >
                <div className="text-4xl mb-2">{item.emoji}</div>
                <h3 className="font-bold text-gray-800">{item.name}</h3>
                <p className="text-coffee-gold font-bold text-lg mb-3">฿{item.price}</p>
                
                <div className="flex gap-2 flex-wrap">
                  {item.tags.map((t) => (
                    <button 
                      key={t} 
                      onClick={() => addToCart(item, t)}
                      className="flex-1 px-2 py-1 text-sm bg-coffee-dark text-white rounded hover:bg-opacity-80 transition"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Cart */}
        <div className="w-80 bg-white shadow-lg p-6 overflow-auto flex flex-col">
          <h2 className="text-2xl font-bold text-coffee-dark mb-4">🛒 Cart</h2>

          <div className="flex-1 overflow-auto mb-4">
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">ยังไม่มีสินค้า</p>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div 
                    key={item.key}
                    className="bg-gray-50 p-3 rounded border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.temp}</p>
                        {item.options && (
                          <div className="text-xs text-gray-500 mt-1">
                            • เหลือ {item.options.sweetness}%
                            {item.options.extraShot > 1 && ` • ${item.options.extraShot} ช็อต`}
                            {item.options.topping !== "none" && ` • ${getOptionLabel("TOPPING", item.options.topping)}`}
                          </div>
                        )}
                      </div>
                      <p className="font-bold text-coffee-dark">฿{(item.price + (item.optionsExtra || 0)) * item.qty}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => changeQty(item.key, -1)}
                          className="w-8 h-8 rounded bg-red-500 text-white hover:bg-red-600"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-semibold">{item.qty}</span>
                        <button 
                          onClick={() => changeQty(item.key, 1)}
                          className="w-8 h-8 rounded bg-green-500 text-white hover:bg-green-600"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => changeQty(item.key, -item.qty)}
                        className="text-red-600 text-sm hover:text-red-800 font-semibold"
                      >
                        ลบ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Note Input */}
          {cartItems.length > 0 && (
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-700">หมายเหตุ</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-2 border rounded text-sm resize-none h-20"
                placeholder="เช่น ไม่ใส่น้ำตาล..."
              />
            </div>
          )}

          {/* Total */}
          <div className="bg-coffee-dark text-white p-4 rounded-lg mb-4">
            <div className="flex justify-between mb-2">
              <span>รวมทั้งสิ้น</span>
              <span className="text-2xl font-bold">฿{total}</span>
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm mb-3 text-center">{error}</p>
          )}

          <div className="flex gap-2">
            <button 
              onClick={clearCart}
              className="flex-1 px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 font-semibold"
            >
              เคลียร์
            </button>
            <button 
              onClick={handleCheckout}
              disabled={cartItems.length === 0 || loading}
              className="flex-1 px-4 py-3 rounded bg-green-600 text-white hover:bg-green-700 font-bold disabled:bg-gray-400"
            >
              {loading ? "กำลังส่ง..." : "ชำระเงิน"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}