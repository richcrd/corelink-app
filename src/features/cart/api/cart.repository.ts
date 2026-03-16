import { del, get, patch, post } from "@/src/shared/http/http";
import { ENDPOINTS } from "@/src/shared/http/endpoints";
import type {
  AddCartItemRequest,
  Cart,
  UpdateCartItemRequest,
} from "../types/Cart";

export const cartRepository = {
  getCart: () => get<Cart>(ENDPOINTS.cart.get),

  addItem: (body: AddCartItemRequest) =>
    post<AddCartItemRequest, Cart>(ENDPOINTS.cart.addItem, body),

  updateItem: (branchProductId: number, body: UpdateCartItemRequest) =>
    patch<UpdateCartItemRequest, Cart>(
      ENDPOINTS.cart.updateItem(branchProductId),
      body,
    ),

  removeItem: (branchProductId: number) =>
    del<Cart>(ENDPOINTS.cart.removeItem(branchProductId)),

  clearCart: () => del<Cart>(ENDPOINTS.cart.clear),
};
