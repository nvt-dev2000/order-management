import { useQuery } from "@tanstack/react-query";

import { productKeys } from "@/constants/query-keys";
import type { ProductListParams } from "@/schemas/products/product.schema";
import { productsApi } from "@/services/products/products.api";

export function useProducts(params?: ProductListParams) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productsApi.list(params),
  });
}

/** All active products for order line item picker */
export function useProductsCatalog() {
  return useQuery({
    queryKey: productKeys.list({ limit: 100, status: "active" }),
    queryFn: () => productsApi.list({ limit: 100, status: "active", page: 1 }),
  });
}
