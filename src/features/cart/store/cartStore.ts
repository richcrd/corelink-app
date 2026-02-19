import { create } from 'zustand';

import type { Product } from '@/src/features/cart/types/Product';
import { CartItem } from '../types/Cart';
import { getCartItemsCount, getCartTotal } from '../types/Cart';

type CartStore = {
  items: CartItem[];
  add: (product: Product) => void;
  decrement: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  add: (product) =>
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      if (!existing) return { items: [...state.items, { product, quantity: 1 }] };
      return {
        items: state.items.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)),
      };
    }),
  decrement: (productId) =>
    set((state) => {
      const item = state.items.find((i) => i.product.id === productId);
      if (!item) return state;
      if (item.quantity <= 1) return { items: state.items.filter((i) => i.product.id !== productId) };
      return {
        items: state.items.map((i) => (i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i)),
      };
    }),
  remove: (productId) => set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) })),
  clear: () => set({ items: [] }),
  totalItems: () => getCartItemsCount(get().items),
  totalPrice: () => getCartTotal(get().items),
}));
