import { env } from "@/config/env";
import { api } from "@/services/client";
import { productsMockApi } from "@/services/mock/products.mock";
import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { Product } from "@/types/products/product.types";
import type {
  CreateProductInput,
  ProductListParams,
  UpdateProductInput,
} from "@/schemas/products/product.schema";

const productsApiReal = {
  list: async (params?: ProductListParams) => {
    const { data } = await api.get<PaginatedResponse<Product>>(
      API_ENDPOINTS.PRODUCTS.LIST,
      { params },
    );
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<Product>>(
      API_ENDPOINTS.PRODUCTS.DETAIL(id),
    );
    return data.data;
  },

  create: async (payload: CreateProductInput) => {
    const { data } = await api.post<ApiResponse<Product>>(
      API_ENDPOINTS.PRODUCTS.CREATE,
      payload,
    );
    return data.data;
  },

  update: async (id: string, payload: UpdateProductInput) => {
    const { data } = await api.put<ApiResponse<Product>>(
      API_ENDPOINTS.PRODUCTS.UPDATE(id),
      payload,
    );
    return data.data;
  },

  delete: async (id: string) => {
    await api.delete(API_ENDPOINTS.PRODUCTS.DELETE(id));
  },
};

export const productsApi = env.VITE_USE_MOCK
  ? productsMockApi
  : productsApiReal;
