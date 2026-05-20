import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { returnKeys } from "@/constants/query-keys";
import { useAppRoutes } from "@/hooks/use-app-routes";
import { t } from "@/utils/i18n";
import type {
  CreateReturnInput,
  UpdateReturnStatusInput,
} from "@/schemas/returns/return.schema";
import { returnsApi } from "@/services/returns/returns.api";

export function useCreateReturn() {
  const queryClient = useQueryClient();
  const routes = useAppRoutes();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (input: CreateReturnInput) => returnsApi.create(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: returnKeys.all });
      toast.success(t("returns:toast.createSuccess"));
      navigate(routes.returns.detail(data.id));
    },
    onError: () => {
      toast.error(t("returns:toast.createFailed"));
    },
  });
}

export function useUpdateReturnStatus(returnId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateReturnStatusInput) =>
      returnsApi.updateStatus(returnId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: returnKeys.all });
      queryClient.invalidateQueries({ queryKey: returnKeys.detail(returnId) });
      toast.success(t("returns:toast.statusUpdated"));
    },
  });
}
