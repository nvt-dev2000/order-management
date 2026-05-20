import { ORDER_STATUS } from "@/constants/order-status";

export const HISTORY_TAB = {
  ALL: "all",
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type HistoryTab = (typeof HISTORY_TAB)[keyof typeof HISTORY_TAB];

export const HISTORY_TAB_STATUSES = {
  [HISTORY_TAB.ACTIVE]: [
    ORDER_STATUS.PENDING,
    ORDER_STATUS.CONFIRMED,
    ORDER_STATUS.SHIPPING,
  ],
  [HISTORY_TAB.COMPLETED]: [ORDER_STATUS.DELIVERED],
  [HISTORY_TAB.CANCELLED]: [ORDER_STATUS.CANCELLED],
} as const;
