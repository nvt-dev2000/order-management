import { useQuery } from "@tanstack/react-query";

import { ordersApi } from "@/services/orders/orders.api";
import { orderKeys } from "@/constants/query-keys";

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => ordersApi.getById(id),
    enabled: Boolean(id),
  });
}
