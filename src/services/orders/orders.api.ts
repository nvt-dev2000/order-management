import { env } from "@/config/env";
import { api } from "@/services/client";
import { ordersMockApi } from "@/services/mock/orders.mock";
import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

import type { Order } from "@/types/orders/order.types";
import type {
  CreateOrderInput,
  OrderListParams,
  UpdateOrderInput,
} from "@/schemas/orders/order.schema";

const ordersApiReal = {
  list: async (params?: OrderListParams) => {
    const { data } = await api.get<PaginatedResponse<Order>>(
      API_ENDPOINTS.ORDERS.LIST,
      { params },
    );
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<Order>>(
      API_ENDPOINTS.ORDERS.DETAIL(id),
    );
    return data.data;
  },

  create: async (payload: CreateOrderInput) => {
    const { data } = await api.post<ApiResponse<Order>>(
      API_ENDPOINTS.ORDERS.CREATE,
      payload,
    );
    return data.data;
  },

  update: async (id: string, payload: UpdateOrderInput) => {
    const { data } = await api.put<ApiResponse<Order>>(
      API_ENDPOINTS.ORDERS.UPDATE(id),
      payload,
    );
    return data.data;
  },

  delete: async (id: string) => {
    await api.delete(API_ENDPOINTS.ORDERS.DELETE(id));
  },
};

export const ordersApi = env.VITE_USE_MOCK ? ordersMockApi : ordersApiReal;
