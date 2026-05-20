import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/root-redirect.tsx"),
  route(":locale", "components/layouts/locale-layout.tsx", [
    layout("components/layouts/auth-layout.tsx", [
      route("login", "pages/login/index.tsx"),
    ]),
    layout("components/layouts/main/layout.tsx", [
      index("pages/dashboard.tsx"),
      route("history", "pages/history/index.tsx"),
      ...prefix("returns", [
        index("pages/returns/index.tsx"),
        route("new", "pages/returns/new.tsx"),
        route(":returnId", "pages/returns/return-detail.tsx"),
      ]),
      ...prefix("orders", [
        index("pages/orders/index.tsx"),
        route("new", "pages/orders/new.tsx"),
        route(":orderId/edit", "pages/orders/order-edit.tsx"),
        route(":orderId", "pages/orders/order-detail.tsx"),
      ]),
      ...prefix("products", [
        index("pages/products/index.tsx"),
        route("new", "pages/products/new.tsx"),
        route(":productId/edit", "pages/products/edit.tsx"),
        route(":productId", "pages/products/detail.tsx"),
      ]),
    ]),
  ]),
  route("*", "routes/add-locale-redirect.tsx"),
] satisfies RouteConfig;
