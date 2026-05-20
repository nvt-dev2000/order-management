import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { productKeys } from "@/constants/query-keys";
import { useAppRoutes } from "@/hooks/use-app-routes";
import { t } from "@/utils/i18n";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "@/schemas/products/product.schema";
import { productsApi } from "@/services/products/products.api";

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const routes = useAppRoutes();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (input: CreateProductInput) => productsApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success(t("common:toast.addSuccess"));
      navigate(routes.products.list);
    },
  });
}

export function useUpdateProduct(productId: string) {
  const queryClient = useQueryClient();
  const routes = useAppRoutes();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (input: UpdateProductInput) =>
      productsApi.update(productId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(productId),
      });
      toast.success(t("common:toast.updateSuccess"));
      navigate(routes.products.detail(productId));
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const routes = useAppRoutes();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (productId: string) => productsApi.delete(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success(t("common:toast.deleteSuccess"));
      navigate(routes.products.list);
    },
  });
}
