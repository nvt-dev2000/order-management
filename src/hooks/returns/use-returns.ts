import { useQuery } from "@tanstack/react-query";

import { returnKeys } from "@/constants/query-keys";
import type { ReturnListParams } from "@/schemas/returns/return.schema";
import { returnsApi } from "@/services/returns/returns.api";

export function useReturns(params?: ReturnListParams) {
  return useQuery({
    queryKey: returnKeys.list(params),
    queryFn: () => returnsApi.list(params),
  });
}
