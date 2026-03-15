import { useQuery } from "@tanstack/react-query";
import { cartRepository } from "../api/cart.repository";

export function useCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: cartRepository.getCart,
    staleTime: 1000 * 15,
  });
}
