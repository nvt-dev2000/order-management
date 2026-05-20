import { useQuery } from "@tanstack/react-query";

import { productKeys } from "@/constants/query-keys";
import { productsApi } from "@/services/products/products.api";

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsApi.getById(id),
    enabled: Boolean(id),
  });
}
