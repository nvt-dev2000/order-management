import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";

import { PAGINATION } from "@/constants";

import {
  orderListParamsSchema,
  type OrderListParams,
} from "@/schemas/orders/order.schema";

interface SetParamsOptions {
  resetPage?: boolean;
}

export function useOrderListParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo<OrderListParams>(() => {
    const raw = {
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
      search: searchParams.get("q") ?? undefined,
      status: searchParams.get("status") ?? undefined,
    };
    const parsed = orderListParamsSchema.safeParse(raw);
    const value = parsed.success ? parsed.data : {};
    return {
      page: value.page ?? PAGINATION.DEFAULT_PAGE,
      limit: value.limit ?? PAGINATION.DEFAULT_LIMIT,
      search: value.search,
      status: value.status,
    };
  }, [searchParams]);

  const setParams = useCallback(
    (next: Partial<OrderListParams>, options: SetParamsOptions = {}) => {
      setSearchParams(
        (prev) => {
          const merged = new URLSearchParams(prev);
          const apply = (key: string, value: unknown) => {
            if (value === undefined || value === null || value === "") {
              merged.delete(key);
            } else {
              merged.set(key, String(value));
            }
          };

          if ("page" in next) apply("page", next.page);
          if ("limit" in next) apply("limit", next.limit);
          if ("search" in next) apply("q", next.search);
          if ("status" in next) apply("status", next.status);

          if (options.resetPage) merged.delete("page");

          return merged;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { params, setParams };
}
