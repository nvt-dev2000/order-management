import enAuth from "./locales/en/auth.json";
import enCommon from "./locales/en/common.json";
import enDashboard from "./locales/en/dashboard.json";
import enErrors from "./locales/en/errors.json";
import enOrders from "./locales/en/orders.json";
import enProducts from "./locales/en/products.json";
import enReturns from "./locales/en/returns.json";
import enValidation from "./locales/en/validation.json";
import viAuth from "./locales/vi/auth.json";
import viCommon from "./locales/vi/common.json";
import viDashboard from "./locales/vi/dashboard.json";
import viErrors from "./locales/vi/errors.json";
import viOrders from "./locales/vi/orders.json";
import viProducts from "./locales/vi/products.json";
import viReturns from "./locales/vi/returns.json";
import viValidation from "./locales/vi/validation.json";

export const resources = {
  vi: {
    common: viCommon,
    validation: viValidation,
    errors: viErrors,
    auth: viAuth,
    orders: viOrders,
    products: viProducts,
    returns: viReturns,
    dashboard: viDashboard,
  },
  en: {
    common: enCommon,
    validation: enValidation,
    errors: enErrors,
    auth: enAuth,
    orders: enOrders,
    products: enProducts,
    returns: enReturns,
    dashboard: enDashboard,
  },
} as const;

export type AppNamespaces = keyof (typeof resources)["vi"];

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: (typeof resources)["vi"];
  }
}
