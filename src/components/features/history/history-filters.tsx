import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { DEBOUNCE_MS } from "@/constants";
import { HISTORY_TAB, type HistoryTab } from "@/constants/history";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { useHistoryParams } from "@/hooks/history/use-history-params";

const TABS: HistoryTab[] = [
  HISTORY_TAB.ALL,
  HISTORY_TAB.ACTIVE,
  HISTORY_TAB.COMPLETED,
  HISTORY_TAB.CANCELLED,
];

export function HistoryFilters() {
  const { t } = useTranslation("orders");
  const { params, setParams } = useHistoryParams();

  const [searchInput, setSearchInput] = useState(params.search ?? "");
  const debouncedSearch = useDebounce(searchInput, DEBOUNCE_MS.SEARCH);

  useEffect(() => {
    const next = debouncedSearch.trim() || undefined;
    if (next !== params.search) {
      setParams({ search: next });
    }
  }, [debouncedSearch, params.search, setParams]);

  const hasSearch = Boolean(params.search);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <Button
            key={tab}
            type="button"
            size="sm"
            variant={params.tab === tab ? "default" : "outline"}
            onClick={() => setParams({ tab })}
            className={cn(params.tab === tab && "pointer-events-none")}
          >
            {t(`historyTabs.${tab}`)}
          </Button>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          placeholder={t("historySearchPlaceholder")}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-9"
          aria-label={t("historySearchAriaLabel")}
        />
        {hasSearch && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-1 size-8 -translate-y-1/2"
            onClick={() => {
              setSearchInput("");
              setParams({ search: undefined });
            }}
            aria-label={t("clearFilters")}
          >
            <X className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
