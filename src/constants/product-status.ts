export const PRODUCT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type ProductStatus =
  (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

export const PRODUCT_CATEGORIES = [
  "electronics",
  "fashion",
  "home",
  "food",
  "beauty",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
