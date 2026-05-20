import type { Locale } from "@/i18n/config";

/** Path segments without locale prefix */
export const ROUTE_SEGMENTS = {
  login: "login",
  history: "history",
  returns: {
    list: "returns",
    new: "returns/new",
    detail: (id: string) => `returns/${id}`,
  },
  orders: {
    list: "orders",
    new: "orders/new",
    detail: (id: string) => `orders/${id}`,
    edit: (id: string) => `orders/${id}/edit`,
  },
  products: {
    list: "products",
    new: "products/new",
    detail: (id: string) => `products/${id}`,
    edit: (id: string) => `products/${id}/edit`,
  },
} as const;

export function buildRoutes(locale: Locale) {
  const base = `/${locale}`;
  return {
    login: `${base}/${ROUTE_SEGMENTS.login}`,
    dashboard: base,
    history: `${base}/${ROUTE_SEGMENTS.history}`,
    returns: {
      list: `${base}/${ROUTE_SEGMENTS.returns.list}`,
      new: `${base}/${ROUTE_SEGMENTS.returns.new}`,
      detail: (id: string) => `${base}/${ROUTE_SEGMENTS.returns.detail(id)}`,
    },
    orders: {
      list: `${base}/${ROUTE_SEGMENTS.orders.list}`,
      new: `${base}/${ROUTE_SEGMENTS.orders.new}`,
      detail: (id: string) => `${base}/${ROUTE_SEGMENTS.orders.detail(id)}`,
      edit: (id: string) => `${base}/${ROUTE_SEGMENTS.orders.edit(id)}`,
    },
    products: {
      list: `${base}/${ROUTE_SEGMENTS.products.list}`,
      new: `${base}/${ROUTE_SEGMENTS.products.new}`,
      detail: (id: string) => `${base}/${ROUTE_SEGMENTS.products.detail(id)}`,
      edit: (id: string) => `${base}/${ROUTE_SEGMENTS.products.edit(id)}`,
    },
  } as const;
}

export type AppRoutes = ReturnType<typeof buildRoutes>;
