import type { OrderLineItem } from "@/types/orders/order.types";
import type { OrderLineItemInput } from "@/schemas/orders/order.schema";

import { productsStore } from "./products.store";

export function resolveOrderLineItems(
  inputs: OrderLineItemInput[],
): OrderLineItem[] {
  const catalog = productsStore.list();

  return inputs.map((input) => {
    const product = catalog.find((p) => p.id === input.productId);
    if (!product) {
      throw new Error(`Product not found: ${input.productId}`);
    }
    const lineTotal = product.price * input.quantity;
    return {
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      quantity: input.quantity,
      unitPrice: product.price,
      lineTotal,
    };
  });
}

export function sumOrderTotals(items: OrderLineItem[]) {
  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.lineTotal, 0);
  return { itemsCount, totalAmount };
}
