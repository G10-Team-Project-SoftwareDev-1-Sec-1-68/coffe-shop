"use client";
import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  cartItems: [],
  
  // 🟢 1. เพิ่มสินค้าพร้อม Option เข้าตะกร้า
  addToCart: (item, quantity, options) => {
    set((state) => {
      // สร้าง Unique ID เพื่อแยกรายการที่ชื่อเหมือนกันแต่ Option ต่างกัน
      const uniqueId = `${item.id}-${options.size}-${options.milk}-${options.toppings.join(',')}`;
      const existingItemIndex = state.cartItems.findIndex(cartItem => cartItem.uniqueId === uniqueId);
      
      const itemPrice = options.totalPricePerUnit;

      if (existingItemIndex !== -1) {
        // ถ้ามีรายการเดิมอยู่แล้ว ให้บวกจำนวนเพิ่ม
        const updatedCartItems = [...state.cartItems];
        updatedCartItems[existingItemIndex].quantity += quantity;
        return { cartItems: updatedCartItems };
      } else {
        // ถ้าเป็นรายการใหม่ ให้เพิ่มเข้าไปใน Array
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

  // 🟢 2. อัปเดตจำนวน (เพิ่ม/ลด) และลบรายการเมื่อเหลือ 0 (ตัวที่เนมทำพังเมื่อกี้)
  updateQuantity: (uniqueId, newQuantity) => {
    set((state) => {
      // 🚩 ถ้าจำนวนลดลงจนน้อยกว่าหรือเท่ากับ 0 ให้ลบรายการนั้นทิ้งทันที
      if (newQuantity <= 0) {
        return {
          cartItems: state.cartItems.filter((item) => item.uniqueId !== uniqueId),
        };
      }

      // 🚩 ถ้าจำนวนมากกว่า 0 ให้ทำการอัปเดตตัวเลขปกติ
      return {
        cartItems: state.cartItems.map((item) =>
          item.uniqueId === uniqueId ? { ...item, quantity: newQuantity } : item
        ),
      };
    });
  },

  // 🟢 3. คำนวณจำนวนชิ้นทั้งหมดในตะกร้า
  getTotalItems: () => get().cartItems.reduce((acc, item) => acc + item.quantity, 0),
  
  // 🟢 4. คำนวณราคารวมทั้งหมด
  getTotalPrice: () => get().cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0),
  
  // 🟢 5. ลบรายการทั้งหมด (ล้างตะกร้า)
  clearCart: () => set({ cartItems: [] }),
}));