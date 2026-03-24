"use client";

import { useEffect, useState, useRef } from "react";
import { ShoppingCart, Trash2, Plus, Minus, Coffee, Receipt, X } from "lucide-react";
import { usePosStore } from "@/store/posStore";
import Toast from "@/app/components/Toast";
import { useToast } from "@/hooks/useToast";

// ============================================================
// Sub-components
// ============================================================

function CategoryTabs({ categories, active, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => onChange("all")}
        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
          active === "all"
            ? "bg-amber-700 text-white shadow"
            : "bg-white text-gray-600 border border-gray-200 hover:bg-amber-50"
        }`}
      >
        ทั้งหมด
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            active === cat.id
              ? "bg-amber-700 text-white shadow"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-amber-50"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

function ProductCard({ product, onAdd }) {
  const firstVariant = product.variants?.[0];
  const price = firstVariant ? parseFloat(firstVariant.price) : null;

  return (
    <button
      onClick={() => firstVariant && onAdd(product, firstVariant)}
      disabled={!firstVariant}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-300 transition-all p-4 text-left active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex flex-col gap-2"
    >
      {/* Image placeholder */}
      <div className="w-full aspect-square rounded-xl bg-amber-50 flex items-center justify-center text-5xl mb-1 group-hover:bg-amber-100 transition-colors">
        ☕
      </div>
      <p className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2">
        {product.name}
      </p>
      {product.description && (
        <p className="text-xs text-gray-400 line-clamp-1">{product.description}</p>
      )}
      <div className="mt-auto flex items-center justify-between">
        <span className="text-amber-700 font-bold text-base">
          {price != null ? `฿${price}` : "—"}
        </span>
        <span className="text-xs bg-amber-700 text-white rounded-full px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          + เพิ่ม
        </span>
      </div>
    </button>
  );
}

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
        <p className="text-xs text-amber-700 font-medium">฿{item.priceAtTime} / ชิ้น</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onDecrease}
          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-8 text-center text-sm font-bold text-gray-800">
          {item.quantity}
        </span>
        <button
          onClick={onIncrease}
          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-green-100 hover:text-green-600 flex items-center justify-center transition-colors"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
      <p className="text-sm font-bold text-gray-800 w-14 text-right shrink-0">
        ฿{(item.priceAtTime * item.quantity).toFixed(0)}
      </p>
      <button
        onClick={onRemove}
        className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

// ============================================================
// Main POS Page
// ============================================================

export default function POSPage() {
  const { cart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, cartTotal } =
    usePosStore();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loadingData, setLoadingData] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [toast, setToast] = useState({ message: "", type: "success" });
  const { toast: welcomeToast, clearToast: clearWelcomeToast } = useToast();

  // ---- Fetch categories + products on mount ----
  useEffect(() => {
    async function load() {
      setLoadingData(true);
      setFetchError("");
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch("/api/categories", { credentials: "include" }),
          fetch("/api/products?isActive=true", { credentials: "include" }),
        ]);
        if (!catRes.ok || !prodRes.ok) throw new Error("โหลดข้อมูลไม่สำเร็จ");
        const catData = await catRes.json();
        const prodData = await prodRes.json();
        setCategories(catData.categories ?? []);
        setProducts(prodData.products ?? []);
      } catch (err) {
        setFetchError(err.message ?? "เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoadingData(false);
      }
    }
    load();
  }, []);

  // ---- Filter products by selected category ----
  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.categoryId === activeCategory);

  // ---- Add to cart ----
  function handleAddToCart(product, variant) {
    addToCart({
      key: variant.id,
      variantId: variant.id,
      productId: product.id,
      name: `${product.name}${variant.name ? ` (${variant.name})` : ""}`,
      priceAtTime: parseFloat(variant.price),
      options: [],
    });
    setToast({ message: `เพิ่ม "${product.name}" ลงตะกร้าแล้ว ✓`, type: "success" });
  }

  // ---- Checkout ----
  async function handleCheckout() {
    if (cart.length === 0) return;
    setCheckoutLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500)); // placeholder
      setToast({ message: "🚧 กำลังพัฒนาระบบชำระเงิน", type: "info" });
    } finally {
      setCheckoutLoading(false);
    }
  }

  const total = cartTotal();
  const itemCount = cart.reduce((s, c) => s + c.quantity, 0);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Toast notifications */}
      {(welcomeToast.message || toast.message) && (
        <Toast
          message={welcomeToast.message || toast.message}
          type={welcomeToast.message ? welcomeToast.type : toast.type}
          onClose={() => {
            clearWelcomeToast();
            setToast({ message: "", type: "success" });
          }}
        />
      )}

      {/* ==================== LEFT PANEL ==================== */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-700 flex items-center justify-center">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">KAFUNG POS</h1>
              <p className="text-xs text-gray-400">Point of Sale</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString("th-TH", {
              weekday: "short", day: "numeric", month: "short",
            })}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-6 pt-4 pb-3 bg-white border-b border-gray-100 shrink-0">
          {loadingData ? (
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-9 w-24 rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <CategoryTabs
              categories={categories}
              active={activeCategory}
              onChange={setActiveCategory}
            />
          )}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-auto p-6">
          {fetchError ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <span className="text-4xl">⚠️</span>
              <p className="text-gray-500">{fetchError}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-amber-700 text-white rounded-xl text-sm"
              >
                ลองใหม่
              </button>
            </div>
          ) : loadingData ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-white border border-gray-100 p-4 animate-pulse">
                  <div className="aspect-square rounded-xl bg-gray-100 mb-3" />
                  <div className="h-4 bg-gray-100 rounded mb-2 w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-2">
              <span className="text-5xl">🫙</span>
              <p className="text-gray-400 text-sm">ไม่มีสินค้าในหมวดหมู่นี้</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ==================== RIGHT PANEL (CART) ==================== */}
      <div className="w-80 xl:w-96 bg-white border-l border-gray-100 flex flex-col shrink-0">
        {/* Cart header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-amber-700" />
            <h2 className="font-bold text-gray-800">รายการสั่ง</h2>
            {itemCount > 0 && (
              <span className="bg-amber-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" /> เคลียร์
            </button>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-auto px-5 py-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3 text-gray-300">
              <ShoppingCart className="w-12 h-12" />
              <p className="text-sm">ยังไม่มีรายการ</p>
              <p className="text-xs">กดที่สินค้าเพื่อเพิ่มลงตะกร้า</p>
            </div>
          ) : (
            cart.map((item) => (
              <CartItem
                key={item.key}
                item={item}
                onIncrease={() => increaseQuantity(item.key)}
                onDecrease={() => decreaseQuantity(item.key)}
                onRemove={() => removeFromCart(item.key)}
              />
            ))
          )}
        </div>

        {/* Summary & Checkout */}
        <div className="px-5 py-4 border-t border-gray-100 shrink-0 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">รายการ</span>
            <span className="text-sm text-gray-700">{itemCount} ชิ้น</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-gray-800">ราคารวมสุทธิ</span>
            <span className="text-2xl font-bold text-amber-700">฿{total.toFixed(0)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || checkoutLoading}
            className="w-full py-4 rounded-2xl bg-amber-700 text-white font-bold text-base
              hover:bg-amber-800 active:scale-95 transition-all
              disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed
              flex items-center justify-center gap-2 shadow-sm"
          >
            <Receipt className="w-5 h-5" />
            {checkoutLoading ? "กำลังดำเนินการ..." : "ชำระเงิน (Checkout)"}
          </button>
        </div>
      </div>
    </div>
  );
}