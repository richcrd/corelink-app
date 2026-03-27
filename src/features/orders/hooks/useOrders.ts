import { useQuery } from "@tanstack/react-query";
import { ordersRepository } from "../api/orders.repository";

export function useOrders() {
  return useQuery({
    queryKey: ["orders", "mine"],
    queryFn: () => ordersRepository.getMyOrders(),
  });
}