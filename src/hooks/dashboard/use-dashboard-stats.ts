import { useQuery } from "@tanstack/react-query";

import { dashboardApi } from "@/services/dashboard/dashboard.api";
import { dashboardKeys } from "@/constants/query-keys";

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: () => dashboardApi.getStats(),
  });
}
