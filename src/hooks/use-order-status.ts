import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { ORDER_STATUS, type OrderStatus } from "@/constants/order-status";

export function useOrderStatusLabel(status: OrderStatus): string {
  const { t } = useTranslation("orders");
  return t(`status.${status}`);
}

export function useOrderStatusOptions() {
  const { t } = useTranslation("orders");

  return useMemo(
    () =>
      (Object.values(ORDER_STATUS) as OrderStatus[]).map((value) => ({
        value,
        label: t(`status.${value}`),
      })),
    [t],
  );
}
