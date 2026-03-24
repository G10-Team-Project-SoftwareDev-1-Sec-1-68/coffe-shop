import { create } from "zustand";

/**
 * POS Cart Store
 *
 * cart item shape:
 * {
 *   key: string,          // unique: `${variantId}`
 *   variantId: string,
 *   productId: string,
 *   name: string,         // "ลาเต้ (ร้อน)"
 *   priceAtTime: number,
 *   quantity: number,
 *   options: [],          // ProductOption[] เพิ่มในภายหลัง
 * }
 */
export const usePosStore = create((set, get) => ({
  cart: [],

  /** เพิ่มสินค้าหรือเพิ่มจำนวนถ้ามีอยู่แล้ว */
  addToCart: (item) => {
    const { cart } = get();
    const existing = cart.find((c) => c.key === item.key);
    if (existing) {
      set({
        cart: cart.map((c) =>
          c.key === item.key ? { ...c, quantity: c.quantity + 1 } : c
        ),
      });
    } else {
      set({ cart: [...cart, { ...item, quantity: 1 }] });
    }
  },

  /** ลบรายการออกจากตะกร้าทั้งหมด */
  removeFromCart: (key) => {
    set({ cart: get().cart.filter((c) => c.key !== key) });
  },

  increaseQuantity: (key) => {
    set({
      cart: get().cart.map((c) =>
        c.key === key ? { ...c, quantity: c.quantity + 1 } : c
      ),
    });
  },

  decreaseQuantity: (key) => {
    const { cart } = get();
    const item = cart.find((c) => c.key === key);
    if (!item) return;
    if (item.quantity <= 1) {
      set({ cart: cart.filter((c) => c.key !== key) });
    } else {
      set({
        cart: cart.map((c) =>
          c.key === key ? { ...c, quantity: c.quantity - 1 } : c
        ),
      });
    }
  },

  clearCart: () => set({ cart: [] }),

  /** ยอดรวม */
  cartTotal: () =>
    get().cart.reduce((sum, c) => sum + c.priceAtTime * c.quantity, 0),
}));
