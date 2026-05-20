import { PAGINATION } from "@/constants/pagination";
import { ORDER_STATUS } from "@/constants/order-status";
import type { PaginatedResponse } from "@/types/api";
import type { Order } from "@/types/orders/order.types";
import type {
  CreateOrderInput,
  OrderListParams,
  UpdateOrderInput,
} from "@/schemas/orders/order.schema";

import { mockDelay } from "./delay";
import { resolveOrderLineItems, sumOrderTotals } from "./order-items";
import { ordersStore } from "./orders.store";

function filterOrders(all: Order[], params?: OrderListParams): Order[] {
  let result = [...all];

  if (params?.search?.trim()) {
    const q = params.search.trim().toLowerCase();
    result = result.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.items.some(
          (item) =>
            item.productName.toLowerCase().includes(q) ||
            item.sku.toLowerCase().includes(q),
        ),
    );
  }

  if (params?.status) {
    result = result.filter((o) => o.status === params.status);
  }

  result.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return result;
}

function paginate<T>(
  items: T[],
  page: number,
  limit: number,
): PaginatedResponse<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * limit;

  return {
    data: items.slice(start, start + limit),
    meta: { page: safePage, limit, total, totalPages },
  };
}

function nextOrderNumber(existing: Order[]): string {
  const max = existing.reduce((acc, o) => {
    const n = Number.parseInt(o.orderNumber.replace(/\D/g, ""), 10);
    return Number.isNaN(n) ? acc : Math.max(acc, n);
  }, 0);
  return `ORD-${String(max + 1).padStart(4, "0")}`;
}

function applyOrderPayload(
  base: Partial<Order> & { customerName: string; customerEmail: string },
  payload: CreateOrderInput | UpdateOrderInput,
): Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt"> {
  const items = payload.items
    ? resolveOrderLineItems(payload.items)
    : (base.items ?? []);
  const { itemsCount, totalAmount } = sumOrderTotals(items);

  return {
    customerName: payload.customerName ?? base.customerName!,
    customerEmail: payload.customerEmail ?? base.customerEmail!,
    status: payload.status ?? base.status ?? ORDER_STATUS.PENDING,
    items,
    itemsCount,
    totalAmount,
  };
}

export const ordersMockApi = {
  list: async (params?: OrderListParams): Promise<PaginatedResponse<Order>> => {
    await mockDelay();
    const page = params?.page ?? PAGINATION.DEFAULT_PAGE;
    const limit = params?.limit ?? PAGINATION.DEFAULT_LIMIT;
    const filtered = filterOrders(ordersStore.list(), params);
    return paginate(filtered, page, limit);
  },

  getById: async (id: string): Promise<Order> => {
    await mockDelay();
    const order = ordersStore.list().find((o) => o.id === id);
    if (!order) throw new Error("Order not found");
    return order;
  },

  create: async (payload: CreateOrderInput): Promise<Order> => {
    await mockDelay();
    const now = new Date().toISOString();
    const all = ordersStore.list();
    const body = applyOrderPayload(
      {
        customerName: payload.customerName,
        customerEmail: payload.customerEmail,
      },
      payload,
    );
    const created: Order = {
      id: `ord-${crypto.randomUUID()}`,
      orderNumber: nextOrderNumber(all),
      ...body,
      createdAt: now,
      updatedAt: now,
    };
    ordersStore.replace([created, ...all]);
    return created;
  },

  update: async (id: string, payload: UpdateOrderInput): Promise<Order> => {
    await mockDelay();
    const all = ordersStore.list();
    const index = all.findIndex((o) => o.id === id);
    if (index === -1) throw new Error("Order not found");

    const current = all[index];
    const body = applyOrderPayload(current, payload);
    const updated: Order = {
      ...current,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    const next = [...all];
    next[index] = updated;
    ordersStore.replace(next);
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await mockDelay();
    const all = ordersStore.list();
    const next = all.filter((o) => o.id !== id);
    if (next.length === all.length) throw new Error("Order not found");
    ordersStore.replace(next);
  },
};
