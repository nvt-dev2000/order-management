import type { Order } from "@/types/orders/order.types";

import { SEED_ORDERS } from "./orders.seed";

let orders: Order[] = structuredClone(SEED_ORDERS);

export const ordersStore = {
  list: (): Order[] => orders,

  replace: (next: Order[]) => {
    orders = next;
  },

  reset: () => {
    orders = structuredClone(SEED_ORDERS);
  },
};
