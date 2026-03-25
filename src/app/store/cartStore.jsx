"use client";
import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  cartItems: [],
  
  // 🟢 เพิ่มสินค้าพร้อม Option เข้าตะกร้า
  addToCart: (item, quantity, options) => {
    set((state) => {
      // สร้าง Unique ID เพื่อแยกรายการที่ชื่อเหมือนกันแต่ Option ต่างกัน
      const uniqueId = `${item.id}-${options.size}-${options.milk}-${options.toppings.join(',')}`;
      const existingItemIndex = state.cartItems.findIndex(cartItem => cartItem.uniqueId === uniqueId);
      
      const itemPrice = options.totalPricePerUnit;

      if (existingItemIndex !== -1) {
        const updatedCartItems = [...state.cartItems];
        updatedCartItems[existingItemIndex].quantity += quantity;
        return { cartItems: updatedCartItems };
      } else {
        return { 
          cartItems: [
            ...state.cartItems, 
            { 
              ...item, 
              uniqueId, 
              quantity, 
              price: itemPrice,
              selectedOptions: options.displayString 
            }
          ] 
        };
      }
    });
  },

  getTotalItems: () => get().cartItems.reduce((acc, item) => acc + item.quantity, 0),
  getTotalPrice: () => get().cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0),
  clearCart: () => set({ cartItems: [] }),
}));