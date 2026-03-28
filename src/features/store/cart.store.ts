import { create } from 'zustand';

import { Cart, getCartItemsCount, getCartTotal } from '../cart';

type CartStore = {
  cart: Cart | null;
  setCart: (cart: Cart | null) => void;
  clear: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  cart: null,
  
  setCart: (cart) => set({ cart }),

  clear: () => set({ cart: null }),

  totalItems: () => {
    const cart = get().cart;
    if (!cart) return 0;
    if (typeof cart.totalItems === "number") return cart.totalItems;
    return getCartItemsCount(cart.items ?? []);
  },

  totalPrice: () => {
    const cart = get().cart;
    if (!cart) return 0;
    if (typeof cart.totalAmount === "number") return cart.totalAmount;
    return getCartTotal(cart.items ?? []);
  },

}));
