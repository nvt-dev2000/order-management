import type { TFunction } from "i18next";

import {
  HISTORY_TAB,
  HISTORY_TAB_STATUSES,
  type HistoryTab,
} from "@/constants/history";
import type { Order } from "@/types/orders/order.types";

export function filterOrdersByHistoryTab(
  orders: Order[],
  tab: HistoryTab,
): Order[] {
  if (tab === HISTORY_TAB.ALL) return orders;

  const statuses = HISTORY_TAB_STATUSES[tab];
  return orders.filter((o) =>
    (statuses as readonly string[]).includes(o.status),
  );
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getHistoryDateGroupKey(
  isoDate: string,
  now = new Date(),
): string {
  const date = startOfDay(new Date(isoDate));
  const today = startOfDay(now);
  const diffMs = today.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return "thisWeek";
  return "older";
}

export function groupOrdersByDate(
  orders: Order[],
  t: TFunction<"orders">,
  now = new Date(),
): { label: string; orders: Order[] }[] {
  const map = new Map<string, Order[]>();

  for (const order of orders) {
    const key = getHistoryDateGroupKey(order.createdAt, now);
    const list = map.get(key) ?? [];
    list.push(order);
    map.set(key, list);
  }

  const orderKeys = ["today", "yesterday", "thisWeek", "older"] as const;

  return orderKeys
    .filter((key) => map.has(key))
    .map((key) => ({
      label: t(`historyGroups.${key}`),
      orders: map.get(key)!,
    }));
}
