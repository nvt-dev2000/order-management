import type { ReturnStatus } from "@/constants/return-status";

export interface ReturnLineItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface ReturnRequest {
  id: string;
  returnNumber: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: ReturnStatus;
  reason: string;
  refundAmount: number;
  items: ReturnLineItem[];
  createdAt: string;
  updatedAt: string;
}
