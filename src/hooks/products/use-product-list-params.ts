import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";

import { PAGINATION } from "@/constants";
import {
  productListParamsSchema,
  type ProductListParams,
} from "@/schemas/products/product.schema";

interface SetParamsOptions {
  resetPage?: boolean;
}

export function useProductListParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo<ProductListParams>(() => {
    const raw = {
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
      search: searchParams.get("q") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      status: searchParams.get("status") ?? undefined,
    };
    const parsed = productListParamsSchema.safeParse(raw);
    const value = parsed.success ? parsed.data : {};
    return {
      page: value.page ?? PAGINATION.DEFAULT_PAGE,
      limit: value.limit ?? PAGINATION.DEFAULT_LIMIT,
      search: value.search,
      category: value.category,
      status: value.status,
    };
  }, [searchParams]);

  const setParams = useCallback(
    (next: Partial<ProductListParams>, options: SetParamsOptions = {}) => {
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
          if ("category" in next) apply("category", next.category);
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
