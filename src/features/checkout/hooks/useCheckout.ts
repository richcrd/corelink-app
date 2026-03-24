import { useMutation } from "@tanstack/react-query";
import { checkoutRepository } from "../api/checkout.repository";

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
