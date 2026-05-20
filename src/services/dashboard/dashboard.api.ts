import { env } from "@/config/env";
import { api } from "@/services/client";
import { dashboardMockApi } from "@/services/mock/dashboard.mock";
import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";

import type { DashboardStats } from "@/types/dashboard/dashboard.types";

const dashboardApiReal = {
  getStats: async () => {
    const { data } = await api.get<ApiResponse<DashboardStats>>(
      API_ENDPOINTS.DASHBOARD.STATS,
    );
    return data.data;
  },
};

export const dashboardApi = env.VITE_USE_MOCK
  ? dashboardMockApi
  : dashboardApiReal;
