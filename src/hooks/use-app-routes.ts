import { useMemo } from "react";

import { buildRoutes } from "@/constants/routes";

import { useLocale } from "./use-locale";

export function useAppRoutes() {
  const locale = useLocale();
  return useMemo(() => buildRoutes(locale), [locale]);
}
