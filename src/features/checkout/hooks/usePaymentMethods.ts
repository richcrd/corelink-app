import { useQuery } from "@tanstack/react-query";
import { paymentMethodRepository } from "../api/paymentMethod.repository";

export const QUERY_KEYS = {
  paymentMethods: ["paymentMethods"] as const,
};

export function usePaymentMethods() {
  return useQuery({
    queryKey: QUERY_KEYS.paymentMethods,
    queryFn: paymentMethodRepository.getAll,
  });
}
