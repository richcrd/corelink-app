import { queryClient } from "@/src/shared/http/queryClient";
import { useMutation } from "@tanstack/react-query";
import { AddCartItemRequest } from "../types/Cart";
import { cartRepository } from "../api/cart.repository";

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
