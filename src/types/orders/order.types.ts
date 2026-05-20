import type { OrderStatus } from "@/constants/order-status";

export interface OrderLineItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  items: OrderLineItem[];
  totalAmount: number;
  itemsCount: number;
  createdAt: string;
  updatedAt: string;
}
