import { RETURN_STATUS } from "@/constants/return-status";
import type { Order } from "@/types/orders/order.types";
import type {
  ReturnLineItem,
  ReturnRequest,
} from "@/types/returns/return.types";
import type {
  CreateReturnInput,
  ReturnLineItemInput,
} from "@/schemas/returns/return.schema";

export function resolveReturnLineItems(
  order: Order,
  inputs: ReturnLineItemInput[],
): ReturnLineItem[] {
  return inputs.map((input) => {
    const line = order.items.find((i) => i.productId === input.productId);
    if (!line) {
      throw new Error(`Product not in order: ${input.productId}`);
    }
    if (input.quantity > line.quantity) {
      throw new Error(`Return quantity exceeds ordered quantity`);
    }
    const lineTotal = line.unitPrice * input.quantity;
    return {
      productId: line.productId,
      productName: line.productName,
      sku: line.sku,
      quantity: input.quantity,
      unitPrice: line.unitPrice,
      lineTotal,
    };
  });
}

export function sumReturnRefund(items: ReturnLineItem[]): number {
  return items.reduce((sum, item) => sum + item.lineTotal, 0);
}

export function buildReturnFromOrder(
  order: Order,
  payload: Omit<CreateReturnInput, "orderId"> & {
    status?: ReturnRequest["status"];
  },
): Omit<ReturnRequest, "id" | "returnNumber" | "createdAt" | "updatedAt"> {
  const items = resolveReturnLineItems(order, payload.items);
  const refundAmount = sumReturnRefund(items);

  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    status: payload.status ?? RETURN_STATUS.PENDING,
    reason: payload.reason,
    refundAmount,
    items,
  };
}
