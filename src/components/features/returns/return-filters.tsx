import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { DEBOUNCE_MS } from "@/constants";
import type { ReturnStatus } from "@/constants/return-status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { useReturnStatusOptions } from "@/hooks/use-return-status";
import { useReturnListParams } from "@/hooks/returns/use-return-list-params";

const ALL = "__all__";

export function ReturnFilters() {
  const { t } = useTranslation("returns");
  const { params, setParams } = useReturnListParams();
  const statusOptions = useReturnStatusOptions();

  const [searchInput, setSearchInput] = useState(params.search ?? "");
  const debouncedSearch = useDebounce(searchInput, DEBOUNCE_MS.SEARCH);

  useEffect(() => {
    const next = debouncedSearch.trim() || undefined;
    if (next !== params.search) {
      setParams({ search: next }, { resetPage: true });
    }
  }, [debouncedSearch, params.search, setParams]);

  const hasFilter = Boolean(params.search) || Boolean(params.status);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative w-full max-w-sm">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          placeholder={t("searchPlaceholder")}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-9"
          aria-label={t("searchAriaLabel")}
        />
      </div>

      <Select
        value={params.status ?? ALL}
        onValueChange={(value) =>
          setParams(
            { status: value === ALL ? undefined : (value as ReturnStatus) },
            { resetPage: true },
          )
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t("allStatuses")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{t("allStatuses")}</SelectItem>
          {statusOptions.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilter && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSearchInput("");
            setParams({
              search: undefined,
              status: undefined,
              page: undefined,
            });
          }}
        >
          <X className="size-4" />
          {t("clearFilters")}
        </Button>
      )}
    </div>
  );
}
