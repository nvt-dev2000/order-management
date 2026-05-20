import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { dashboardKeys, orderKeys } from "@/constants/query-keys";
import { useAppRoutes } from "@/hooks/use-app-routes";
import { t } from "@/utils/i18n";

import { ordersApi } from "@/services/orders/orders.api";
import type {
  CreateOrderInput,
  UpdateOrderInput,
} from "@/schemas/orders/order.schema";

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const routes = useAppRoutes();

  return useMutation({
    mutationFn: (input: CreateOrderInput) => ordersApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      toast.success(t("common:toast.addSuccess"));
      navigate(routes.orders.list);
    },
  });
}

export function useUpdateOrder(orderId: string) {
  const queryClient = useQueryClient();
  const routes = useAppRoutes();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (input: UpdateOrderInput) => ordersApi.update(orderId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
      toast.success(t("common:toast.updateSuccess"));
      navigate(routes.orders.detail(orderId));
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const routes = useAppRoutes();

  return useMutation({
    mutationFn: (orderId: string) => ordersApi.delete(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      toast.success(t("common:toast.deleteSuccess"));
      navigate(routes.orders.list);
    },
  });
}
