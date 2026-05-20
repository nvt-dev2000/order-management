import { useQuery } from "@tanstack/react-query";

import { returnKeys } from "@/constants/query-keys";
import { returnsApi } from "@/services/returns/returns.api";

export function useReturn(id: string) {
  return useQuery({
    queryKey: returnKeys.detail(id),
    queryFn: () => returnsApi.getById(id),
    enabled: Boolean(id),
  });
}
