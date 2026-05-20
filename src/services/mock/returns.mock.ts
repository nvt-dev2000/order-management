import { PAGINATION } from "@/constants/pagination";
import { ORDER_STATUS } from "@/constants/order-status";
import type { PaginatedResponse } from "@/types/api";
import type { ReturnRequest } from "@/types/returns/return.types";
import type {
  CreateReturnInput,
  ReturnListParams,
  UpdateReturnStatusInput,
} from "@/schemas/returns/return.schema";

import { mockDelay } from "./delay";
import { ordersStore } from "./orders.store";
import { buildReturnFromOrder } from "./returns.helpers";
import { returnsStore } from "./returns.store";

function filterReturns(
  all: ReturnRequest[],
  params?: ReturnListParams,
): ReturnRequest[] {
  let result = [...all];

  if (params?.search?.trim()) {
    const q = params.search.trim().toLowerCase();
    result = result.filter(
      (r) =>
        r.returnNumber.toLowerCase().includes(q) ||
        r.orderNumber.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q),
    );
  }

  if (params?.status) {
    result = result.filter((r) => r.status === params.status);
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

function nextReturnNumber(existing: ReturnRequest[]): string {
  const max = existing.reduce((acc, r) => {
    const n = Number.parseInt(r.returnNumber.replace(/\D/g, ""), 10);
    return Number.isNaN(n) ? acc : Math.max(acc, n);
  }, 0);
  return `RET-${String(max + 1).padStart(4, "0")}`;
}

export const returnsMockApi = {
  list: async (
    params?: ReturnListParams,
  ): Promise<PaginatedResponse<ReturnRequest>> => {
    await mockDelay();
    const page = params?.page ?? PAGINATION.DEFAULT_PAGE;
    const limit = params?.limit ?? PAGINATION.DEFAULT_LIMIT;
    const filtered = filterReturns(returnsStore.list(), params);
    return paginate(filtered, page, limit);
  },

  getById: async (id: string): Promise<ReturnRequest> => {
    await mockDelay();
    const item = returnsStore.list().find((r) => r.id === id);
    if (!item) throw new Error("Return not found");
    return item;
  },

  create: async (payload: CreateReturnInput): Promise<ReturnRequest> => {
    await mockDelay();
    const order = ordersStore.list().find((o) => o.id === payload.orderId);
    if (!order) throw new Error("Order not found");
    if (order.status !== ORDER_STATUS.DELIVERED) {
      throw new Error("Only delivered orders can be returned");
    }

    const now = new Date().toISOString();
    const all = returnsStore.list();
    const body = buildReturnFromOrder(order, payload);
    const created: ReturnRequest = {
      id: `ret-${crypto.randomUUID()}`,
      returnNumber: nextReturnNumber(all),
      ...body,
      createdAt: now,
      updatedAt: now,
    };
    returnsStore.replace([created, ...all]);
    return created;
  },

  updateStatus: async (
    id: string,
    payload: UpdateReturnStatusInput,
  ): Promise<ReturnRequest> => {
    await mockDelay();
    const all = returnsStore.list();
    const index = all.findIndex((r) => r.id === id);
    if (index === -1) throw new Error("Return not found");

    const current = all[index];
    const updated: ReturnRequest = {
      ...current,
      status: payload.status,
      updatedAt: new Date().toISOString(),
    };
    const next = [...all];
    next[index] = updated;
    returnsStore.replace(next);
    return updated;
  },
};
