export interface CartValidationResponse {
  isValid: boolean;
  errors: string[];
  subtotal: number;
  total: number;
}

export interface CheckoutRequest {
  paymentMethodId: number;
  paymentReference?: string;
}

export interface CheckoutResponse {
  orderId: number;
}

export interface PaymentMethod {
  id: number;
  name: string;
  icon?: string;
}
