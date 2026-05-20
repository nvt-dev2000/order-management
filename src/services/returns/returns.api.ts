import { env } from "@/config/env";
import { api } from "@/services/client";
import { returnsMockApi } from "@/services/mock/returns.mock";
import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { ReturnRequest } from "@/types/returns/return.types";
import type {
  CreateReturnInput,
  ReturnListParams,
  UpdateReturnStatusInput,
} from "@/schemas/returns/return.schema";

const returnsApiReal = {
  list: async (params?: ReturnListParams) => {
    const { data } = await api.get<PaginatedResponse<ReturnRequest>>(
      API_ENDPOINTS.RETURNS.LIST,
      { params },
    );
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<ReturnRequest>>(
      API_ENDPOINTS.RETURNS.DETAIL(id),
    );
    return data.data;
  },

  create: async (payload: CreateReturnInput) => {
    const { data } = await api.post<ApiResponse<ReturnRequest>>(
      API_ENDPOINTS.RETURNS.CREATE,
      payload,
    );
    return data.data;
  },

  updateStatus: async (id: string, payload: UpdateReturnStatusInput) => {
    const { data } = await api.patch<ApiResponse<ReturnRequest>>(
      API_ENDPOINTS.RETURNS.UPDATE_STATUS(id),
      payload,
    );
    return data.data;
  },
};

export const returnsApi = env.VITE_USE_MOCK ? returnsMockApi : returnsApiReal;
