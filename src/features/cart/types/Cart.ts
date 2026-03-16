
export type CartItem = {
  id: number;
  branchProductId: number;
  productId: number;
  productName: string;
  imageUrl?: string | null;
  price: number;
  quantity: number;
  subtotal: number;
};

export type Cart = {
  id: number;
  userId: number;
  branchId: number;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
};

export type AddCartItemRequest = {
  branchProductId: number;
  quantity: number;
}

export type UpdateCartItemRequest = {
  quantityDelta: number;
}

export function getCartItemsCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.subtotal, 0);
}
