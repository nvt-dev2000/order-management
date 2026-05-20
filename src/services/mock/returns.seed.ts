import { ORDER_STATUS } from "@/constants/order-status";
import { RETURN_STATUS } from "@/constants/return-status";
import type { Order } from "@/types/orders/order.types";
import type { ReturnRequest } from "@/types/returns/return.types";
import type { ReturnLineItemInput } from "@/schemas/returns/return.schema";

import { ordersStore } from "./orders.store";
import { buildReturnFromOrder } from "./returns.helpers";

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

/** Build return line input capped to ordered quantity (seed safety) */
function returnItem(
  order: Order,
  lineIndex: number,
  quantity = 1,
): ReturnLineItemInput {
  const line = order.items[lineIndex];
  if (!line) {
    throw new Error(
      `Order ${order.orderNumber} has no line at index ${lineIndex}`,
    );
  }
  return {
    productId: line.productId,
    quantity: Math.min(quantity, line.quantity),
  };
}

function seedReturn(
  index: number,
  orderId: string,
  partial: {
    status: ReturnRequest["status"];
    reason: string;
    itemInputs: ReturnLineItemInput[];
    createdAt?: string;
  },
): ReturnRequest {
  const order = ordersStore.list().find((o) => o.id === orderId);
  if (!order) throw new Error(`Order not found for return seed: ${orderId}`);

  const built = buildReturnFromOrder(order, {
    reason: partial.reason,
    items: partial.itemInputs,
    status: partial.status,
  });

  const createdAt = partial.createdAt ?? daysAgo(index % 10);
  return {
    ...built,
    id: `ret-${index}`,
    returnNumber: `RET-${String(index).padStart(4, "0")}`,
    createdAt,
    updatedAt: createdAt,
  };
}

export function buildSeedReturns(): ReturnRequest[] {
  const delivered = ordersStore
    .list()
    .filter((o) => o.status === ORDER_STATUS.DELIVERED);

  const ord4 = delivered.find((o) => o.id === "ord-4");
  const ord9 = delivered.find((o) => o.id === "ord-9");
  const ord12 = delivered.find((o) => o.id === "ord-12");

  if (!ord4 || !ord9 || !ord12) return [];

  return [
    seedReturn(1, ord4.id, {
      status: RETURN_STATUS.PENDING,
      reason: "Sản phẩm lỗi, khách yêu cầu đổi",
      itemInputs: [returnItem(ord4, 0, 1)],
      createdAt: daysAgo(1),
    }),
    seedReturn(2, ord9.id, {
      status: RETURN_STATUS.APPROVED,
      reason: "Giao nhầm mẫu",
      itemInputs: [returnItem(ord9, 0, 1)],
      createdAt: daysAgo(3),
    }),
    seedReturn(3, ord12.id, {
      status: RETURN_STATUS.REFUNDED,
      reason: "Khách không hài lòng chất lượng",
      itemInputs: [returnItem(ord12, 1, 2), returnItem(ord12, 2, 3)],
      createdAt: daysAgo(5),
    }),
    seedReturn(4, ord4.id, {
      status: RETURN_STATUS.REJECTED,
      reason: "Quá thời hạn đổi trả 7 ngày",
      itemInputs: [returnItem(ord4, 2, 1)],
      createdAt: daysAgo(7),
    }),
  ];
}

export const SEED_RETURNS: ReturnRequest[] = buildSeedReturns();
