import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

import { useAppRoutes } from "@/hooks/use-app-routes";
import { useAuthStore } from "@/stores/auth.store";
import { t } from "@/utils/i18n";

import { authApi } from "@/services/auth/auth.api";
import type { LoginInput } from "@/schemas/auth/login.schema";

type LocationState = { from?: { pathname?: string } } | null;

export function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const routes = useAppRoutes();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (values: LoginInput) => authApi.login(values),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      toast.success(t("common:toast.loginSuccess"));
      const state = location.state as LocationState;
      const redirectTo = state?.from?.pathname ?? routes.dashboard;
      navigate(redirectTo, { replace: true });
    },
  });
}
