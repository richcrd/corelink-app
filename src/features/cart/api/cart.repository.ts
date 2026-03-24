import { del, get, patch, post } from "@/src/shared/http/http";
import { requests } from "@/src/shared/http/endpoints";
import type {
  AddCartItemRequest,
  Cart,
  UpdateCartItemRequest,
} from "../types/Cart";

export const cartRepository = {
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
