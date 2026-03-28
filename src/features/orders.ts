import { useQuery } from "@tanstack/react-query";
import { get } from "@/src/shared/http/http";
import { requests } from "@/src/shared/http/endpoints";

export interface OrderItem {
  productName: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderDetail {
  orderId: number;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

const ordersRepository = {
  getMyOrders: () => get<any>(requests.orders.getMyOrders),
  getDetails: (orderId: number) => get<OrderDetail>(requests.orders.getDetails(orderId)),
};

export function useOrders() {
  return useQuery({
    queryKey: ["orders", "mine"],
    queryFn: () => ordersRepository.getMyOrders(),
  });
}

export function useOrderDetails(orderId?: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => ordersRepository.getDetails(Number(orderId)),
    enabled: !!orderId,
  });
}
