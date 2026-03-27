import { useQuery } from "@tanstack/react-query";
import { ordersRepository } from "../api/orders.repository";

export function useOrderDetails(orderId?: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => ordersRepository.getDetails(Number(orderId)),
    enabled: !!orderId,
  });
}