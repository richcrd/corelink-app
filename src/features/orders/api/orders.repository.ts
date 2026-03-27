import { get } from "@/src/shared/http/http";
import { requests } from "@/src/shared/http/endpoints";
import { OrderDetail } from "../types/Order";

export const ordersRepository = {
  getMyOrders: () => get<any>(requests.orders.getMyOrders),
  getDetails: (orderId: number) => get<OrderDetail>(requests.orders.getDetails(orderId)),
};