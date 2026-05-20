import { Navigate, useLocation } from "react-router";

import { useAppRoutes } from "@/hooks/use-app-routes";
import { useAuthStore } from "@/stores/auth.store";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function RequireAuth({ children }: AuthGuardProps) {
  const token = useAuthStore((s) => s.token);
  const location = useLocation();
  const routes = useAppRoutes();

  if (!token) {
    return (
      <Navigate
        to={routes.login}
        state={{ from: { pathname: location.pathname + location.search } }}
        replace
      />
    );
  }

  return <>{children}</>;
}

export function RedirectIfAuth({ children }: AuthGuardProps) {
  const token = useAuthStore((s) => s.token);
  const routes = useAppRoutes();

  if (token) {
    return <Navigate to={routes.dashboard} replace />;
  }

  return <>{children}</>;
}
