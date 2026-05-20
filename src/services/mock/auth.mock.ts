import type { LoginInput } from "@/schemas/auth/login.schema";
import type { LoginResponse, User } from "@/types/auth/auth.types";

import { mockDelay } from "./delay";

const MOCK_USER: User = {
  id: "user-mock-1",
  email: "admin@example.com",
  name: "Admin Demo",
};

export const authMockApi = {
  login: async (payload: LoginInput): Promise<LoginResponse> => {
    await mockDelay();
    return {
      token: "mock-jwt-token",
      user: {
        ...MOCK_USER,
        email: payload.email.trim() || MOCK_USER.email,
      },
    };
  },

  me: async (): Promise<User> => {
    await mockDelay(200);
    return MOCK_USER;
  },

  logout: async () => {
    await mockDelay(150);
  },
};
