// API endpoints constants
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
  },
  ORDERS: {
    LIST: "/orders",
    DETAIL: (id: string) => `/orders/${id}`,
    CREATE: "/orders",
    UPDATE: (id: string) => `/orders/${id}`,
    DELETE: (id: string) => `/orders/${id}`,
  },
  PRODUCTS: {
    LIST: "/products",
    DETAIL: (id: string) => `/products/${id}`,
    CREATE: "/products",
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
  },
  RETURNS: {
    LIST: "/returns",
    DETAIL: (id: string) => `/returns/${id}`,
    CREATE: "/returns",
    UPDATE_STATUS: (id: string) => `/returns/${id}/status`,
  },
  DASHBOARD: {
    STATS: "/dashboard/stats",
  },
} as const;
