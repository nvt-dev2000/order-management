import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  PRODUCT_CATEGORIES,
  PRODUCT_STATUS,
  type ProductCategory,
  type ProductStatus,
} from "@/constants/product-status";

export function useProductStatusLabel(status: ProductStatus): string {
  const { t } = useTranslation("products");
  return t(`status.${status}`);
}

export function useProductStatusOptions() {
  const { t } = useTranslation("products");

  return useMemo(
    () =>
      (Object.values(PRODUCT_STATUS) as ProductStatus[]).map((value) => ({
        value,
        label: t(`status.${value}`),
      })),
    [t],
  );
}

export function useProductCategoryLabel(category: ProductCategory): string {
  const { t } = useTranslation("products");
  return t(`categories.${category}`);
}

export function useProductCategoryOptions() {
  const { t } = useTranslation("products");

  return useMemo(
    () =>
      PRODUCT_CATEGORIES.map((value) => ({
        value,
        label: t(`categories.${value}`),
      })),
    [t],
  );
}
