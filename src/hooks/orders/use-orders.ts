import { useQuery } from "@tanstack/react-query";

import { ordersApi } from "@/services/orders/orders.api";
import { orderKeys } from "@/constants/query-keys";
import type { OrderListParams } from "@/schemas/orders/order.schema";

export function useOrders(params?: OrderListParams) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => ordersApi.list(params),
    placeholderData: (previous) => previous,
  });
}
