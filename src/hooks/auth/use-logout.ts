import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { useAppRoutes } from "@/hooks/use-app-routes";
import { useAuthStore } from "@/stores/auth.store";
import { t } from "@/utils/i18n";

import { authApi } from "@/services/auth/auth.api";

export function useLogout() {
  const navigate = useNavigate();
  const routes = useAppRoutes();
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      logout();
      queryClient.clear();
      navigate(routes.login, { replace: true });
    },
    onSuccess: () => {
      toast.success(t("common:toast.logoutSuccess"));
    },
  });
}
