import { useQuery, useMutation } from "@tanstack/react-query";
import { get, post } from "@/src/shared/http/http";
import { requests } from "@/src/shared/http/endpoints";

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

const checkoutRepository = {
  validateCart: () => post<void, CartValidationResponse>(requests.checkout.validate, undefined),
  processCheckout: (body: CheckoutRequest) => post<CheckoutRequest, CheckoutResponse>(requests.checkout.process, body),
};

const paymentMethodRepository = {
  getAll: async (): Promise<PaymentMethod[]> => {
    try {
      const response = await get<PaymentMethod[]>(requests.paymentMethod.getAll);
      if (response && response.length > 0) return response;
      throw new Error("No data");
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      throw error;
    }
  },
};

export function useCheckout() {
  const validateMutation = useMutation({
    mutationFn: () => checkoutRepository.validateCart(),
  });

  const processMutation = useMutation({
    mutationFn: (data: Parameters<typeof checkoutRepository.processCheckout>[0]) => 
      checkoutRepository.processCheckout(data),
  });

  return {
    validateCart: validateMutation.mutateAsync,
    isValidating: validateMutation.isPending,
    processCheckout: processMutation.mutateAsync,
    isProcessing: processMutation.isPending,
  };
}

const QUERY_KEYS = {
  paymentMethods: ["paymentMethods"] as const,
};

export function usePaymentMethods() {
  return useQuery({
    queryKey: QUERY_KEYS.paymentMethods,
    queryFn: paymentMethodRepository.getAll,
  });
}
