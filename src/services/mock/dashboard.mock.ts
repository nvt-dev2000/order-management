import { ORDER_STATUS } from "@/constants/order-status";
import type { DashboardStats } from "@/types/dashboard/dashboard.types";

import { mockDelay } from "./delay";
import { ordersStore } from "./orders.store";

function computeStats(): DashboardStats {
  const orders = ordersStore.list();
  const customers = new Set(orders.map((o) => o.customerEmail.toLowerCase()));

  return {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === ORDER_STATUS.PENDING)
      .length,
    revenue: orders
      .filter((o) => o.status !== ORDER_STATUS.CANCELLED)
      .reduce((sum, o) => sum + o.totalAmount, 0),
    customers: customers.size,
  };
}

export const dashboardMockApi = {
  getStats: async (): Promise<DashboardStats> => {
    await mockDelay();
    return computeStats();
  },
};
