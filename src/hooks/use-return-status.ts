import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { RETURN_STATUS, type ReturnStatus } from "@/constants/return-status";

export function useReturnStatusLabel(status: ReturnStatus): string {
  const { t } = useTranslation("returns");
  return t(`status.${status}`);
}

export function useReturnStatusOptions() {
  const { t } = useTranslation("returns");

  return useMemo(
    () =>
      (Object.values(RETURN_STATUS) as ReturnStatus[]).map((value) => ({
        value,
        label: t(`status.${value}`),
      })),
    [t],
  );
}
