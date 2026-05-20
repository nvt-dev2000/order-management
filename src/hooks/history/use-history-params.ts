import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";

import { HISTORY_TAB, type HistoryTab } from "@/constants/history";

export function useHistoryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo(() => {
    const tabRaw = searchParams.get("tab");
    const tab = Object.values(HISTORY_TAB).includes(tabRaw as HistoryTab)
      ? (tabRaw as HistoryTab)
      : HISTORY_TAB.ALL;

    return {
      tab,
      search: searchParams.get("q")?.trim() || undefined,
    };
  }, [searchParams]);

  const setParams = useCallback(
    (next: Partial<{ tab: HistoryTab; search?: string }>) => {
      setSearchParams(
        (prev) => {
          const merged = new URLSearchParams(prev);

          if ("tab" in next) {
            if (next.tab === HISTORY_TAB.ALL) merged.delete("tab");
            else merged.set("tab", next.tab!);
          }

          if ("search" in next) {
            if (!next.search) merged.delete("q");
            else merged.set("q", next.search);
          }

          return merged;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { params, setParams };
}
