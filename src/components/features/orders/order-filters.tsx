import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { DEBOUNCE_MS } from "@/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useOrderStatusOptions } from "@/hooks/use-order-status";
import type { OrderStatus } from "@/constants/order-status";
import { useOrderListParams } from "@/hooks/orders/use-order-list-params";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL = "__all__";

export function OrderFilters() {
  const { t } = useTranslation("orders");
  const { params, setParams } = useOrderListParams();
  const statusOptions = useOrderStatusOptions();

  const [searchInput, setSearchInput] = useState(params.search ?? "");
  const debouncedSearch = useDebounce(searchInput, DEBOUNCE_MS.SEARCH);

  useEffect(() => {
    const next = debouncedSearch.trim() || undefined;
    if (next !== params.search) {
      setParams({ search: next }, { resetPage: true });
    }
  }, [debouncedSearch, params.search, setParams]);

  const handleStatusChange = (value: string) => {
    setParams(
      { status: value === ALL ? undefined : (value as OrderStatus) },
      { resetPage: true },
    );
  };

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

      <Select value={params.status ?? ALL} onValueChange={handleStatusChange}>
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
