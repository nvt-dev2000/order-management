import { env } from "@/config/env";
import { api } from "@/services/client";
import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";

import type { LoginInput } from "@/schemas/auth/login.schema";
import type { LoginResponse, User } from "@/types/auth/auth.types";
import { authMockApi } from "../mock/auth.mock";

const authApiReal = {
  login: async (payload: LoginInput): Promise<LoginResponse> => {
    const { data } = await api.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      payload,
    );
    return data.data;
  },

  me: async (): Promise<User> => {
    const { data } = await api.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME);
    return data.data;
  },

  logout: async () => {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT);
  },
};

export const authApi = env.VITE_USE_MOCK ? authMockApi : authApiReal;
