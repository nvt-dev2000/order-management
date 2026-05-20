import { ORDER_STATUS } from "@/constants/order-status";
import type { Order } from "@/types/orders/order.types";
import type { OrderLineItemInput } from "@/schemas/orders/order.schema";

import { resolveOrderLineItems, sumOrderTotals } from "./order-items";
import { productsStore } from "./products.store";

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function buildOrder(
  index: number,
  partial: {
    customerName: string;
    customerEmail: string;
    status: Order["status"];
    itemInputs: OrderLineItemInput[];
    createdAt?: string;
  },
): Order {
  const items = resolveOrderLineItems(partial.itemInputs);
  const { itemsCount, totalAmount } = sumOrderTotals(items);
  const createdAt = partial.createdAt ?? daysAgo(index % 14);

  return {
    id: `ord-${index}`,
    orderNumber: `ORD-${String(index).padStart(4, "0")}`,
    customerName: partial.customerName,
    customerEmail: partial.customerEmail,
    status: partial.status,
    items,
    totalAmount,
    itemsCount,
    createdAt,
    updatedAt: createdAt,
  };
}

/** Ensure products are loaded before building orders */
function seedOrders(): Order[] {
  void productsStore.list();

  return [
    buildOrder(1, {
      customerName: "Nguyễn Văn An",
      customerEmail: "an.nguyen@example.com",
      status: ORDER_STATUS.PENDING,
      itemInputs: [
        { productId: "prd-1", quantity: 1 },
        { productId: "prd-7", quantity: 2 },
      ],
    }),
    buildOrder(2, {
      customerName: "Trần Thị Bình",
      customerEmail: "binh.tran@example.com",
      status: ORDER_STATUS.CONFIRMED,
      itemInputs: [
        { productId: "prd-3", quantity: 3 },
        { productId: "prd-4", quantity: 1 },
      ],
    }),
    buildOrder(3, {
      customerName: "Lê Minh Cường",
      customerEmail: "cuong.le@example.com",
      status: ORDER_STATUS.SHIPPING,
      itemInputs: [{ productId: "prd-2", quantity: 2 }],
    }),
    buildOrder(4, {
      customerName: "Phạm Thu Dung",
      customerEmail: "dung.pham@example.com",
      status: ORDER_STATUS.DELIVERED,
      itemInputs: [
        { productId: "prd-10", quantity: 1 },
        { productId: "prd-11", quantity: 1 },
        { productId: "prd-9", quantity: 2 },
      ],
    }),
    buildOrder(5, {
      customerName: "Hoàng Văn Em",
      customerEmail: "em.hoang@example.com",
      status: ORDER_STATUS.CANCELLED,
      itemInputs: [{ productId: "prd-8", quantity: 4 }],
    }),
    buildOrder(6, {
      customerName: "John Smith",
      customerEmail: "john.smith@example.com",
      status: ORDER_STATUS.PENDING,
      itemInputs: [
        { productId: "prd-1", quantity: 1 },
        { productId: "prd-10", quantity: 1 },
      ],
    }),
    buildOrder(7, {
      customerName: "Jane Doe",
      customerEmail: "jane.doe@example.com",
      status: ORDER_STATUS.CONFIRMED,
      itemInputs: [
        { productId: "prd-11", quantity: 2 },
        { productId: "prd-5", quantity: 3 },
      ],
    }),
    buildOrder(8, {
      customerName: "Vũ Thị Phương",
      customerEmail: "phuong.vu@example.com",
      status: ORDER_STATUS.SHIPPING,
      itemInputs: [{ productId: "prd-12", quantity: 5 }],
    }),
    buildOrder(9, {
      customerName: "Đặng Quốc Huy",
      customerEmail: "huy.dang@example.com",
      status: ORDER_STATUS.DELIVERED,
      itemInputs: [
        { productId: "prd-4", quantity: 2 },
        { productId: "prd-3", quantity: 2 },
      ],
    }),
    buildOrder(10, {
      customerName: "Bùi Lan Anh",
      customerEmail: "lananh.bui@example.com",
      status: ORDER_STATUS.PENDING,
      itemInputs: [{ productId: "prd-7", quantity: 3 }],
    }),
    buildOrder(11, {
      customerName: "Michael Brown",
      customerEmail: "michael.b@example.com",
      status: ORDER_STATUS.CONFIRMED,
      itemInputs: [
        { productId: "prd-2", quantity: 2 },
        { productId: "prd-5", quantity: 1 },
      ],
    }),
    buildOrder(12, {
      customerName: "Sarah Wilson",
      customerEmail: "sarah.w@example.com",
      status: ORDER_STATUS.DELIVERED,
      itemInputs: [
        { productId: "prd-9", quantity: 1 },
        { productId: "prd-1", quantity: 2 },
        { productId: "prd-8", quantity: 6 },
      ],
    }),
  ];
}

export const SEED_ORDERS: Order[] = seedOrders();
