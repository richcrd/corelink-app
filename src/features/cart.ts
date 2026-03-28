import { useQuery, useMutation } from "@tanstack/react-query";
import { del, get, patch, post } from "@/src/shared/http/http";
import { requests } from "@/src/shared/http/endpoints";
import { queryClient } from "@/src/shared/http/queryClient";

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
};

export type UpdateCartItemRequest = {
  quantityDelta: number;
};

export function getCartItemsCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.subtotal, 0);
}

const cartRepository = {
  getCart: () => get<Cart>(requests.cart.get),

  addItem: (body: AddCartItemRequest) =>
    post<AddCartItemRequest, Cart>(requests.cart.addItem, body),

  updateItem: (branchProductId: number, body: UpdateCartItemRequest) =>
    patch<UpdateCartItemRequest, Cart>(
      requests.cart.updateItem(branchProductId),
      body,
    ),

  removeItem: (branchProductId: number) =>
    del<Cart>(requests.cart.removeItem(branchProductId)),

  clearCart: () => del<Cart>(requests.cart.clear),
};

export function useCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: cartRepository.getCart,
    staleTime: 1000 * 15,
  });
}

function invalidateCart() {
  return queryClient.invalidateQueries({ queryKey: ["cart"] });
}

export function useCartMutations() {
  const addItemMutation = useMutation({
    mutationFn: (payload: AddCartItemRequest) =>
      cartRepository.addItem(payload),
    onSuccess: invalidateCart,
  });

  const updateItemMutation = useMutation({
    mutationFn: (params: { branchProductId: number; quantityDelta: number }) =>
      cartRepository.updateItem(params.branchProductId, {
        quantityDelta: params.quantityDelta,
      }),
    onSuccess: invalidateCart,
  });

  const removeItemMutation = useMutation({
    mutationFn: (branchProductId: number) =>
      cartRepository.removeItem(branchProductId),
    onSuccess: invalidateCart,
  });

  const clearCartMutation = useMutation({
    mutationFn: () => cartRepository.clearCart(),
    onSuccess: invalidateCart,
  });

  return {
    addItem: addItemMutation.mutateAsync,
    updateItem: updateItemMutation.mutateAsync,
    removeItem: removeItemMutation.mutateAsync,
    clearCart: clearCartMutation.mutateAsync,

    isAddingItem: addItemMutation.isPending,
    isUpdatingItem: updateItemMutation.isPending,
    isRemovingItem: removeItemMutation.isPending,
    isClearingCart: clearCartMutation.isPending,
  };
}
