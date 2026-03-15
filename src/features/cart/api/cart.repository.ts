import { get } from "@/src/shared/http/http";
import { ENDPOINTS } from "@/src/shared/http/endpoints";
import type { Cart } from "../types/Cart";

export const cartRepository = {
    getCart: () => get<Cart>(ENDPOINTS.cart.get),
}