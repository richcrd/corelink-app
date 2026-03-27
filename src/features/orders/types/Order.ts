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
