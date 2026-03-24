import { post } from "@/src/shared/http/http";
import { requests } from "@/src/shared/http/endpoints";
import { CartValidationResponse, CheckoutRequest, CheckoutResponse } from "../types/Checkout";

export const checkoutRepository = {
  validateCart: () => post<void, CartValidationResponse>(requests.checkout.validate, undefined),
  processCheckout: (body: CheckoutRequest) => post<CheckoutRequest, CheckoutResponse>(requests.checkout.process, body),
};
