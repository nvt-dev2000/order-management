import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { DEBOUNCE_MS } from "@/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductCategory } from "@/constants/product-status";
import { useDebounce } from "@/hooks/use-debounce";
import {
  useProductCategoryOptions,
  useProductStatusOptions,
} from "@/hooks/use-product-status";
import { useProductListParams } from "@/hooks/products/use-product-list-params";

const ALL = "__all__";

export function ProductFilters() {
  const { t } = useTranslation("products");
  const { params, setParams } = useProductListParams();
  const categoryOptions = useProductCategoryOptions();
  const statusOptions = useProductStatusOptions();

  const [searchInput, setSearchInput] = useState(params.search ?? "");
  const debouncedSearch = useDebounce(searchInput, DEBOUNCE_MS.SEARCH);

  useEffect(() => {
    const next = debouncedSearch.trim() || undefined;
    if (next !== params.search) {
      setParams({ search: next }, { resetPage: true });
    }
  }, [debouncedSearch, params.search, setParams]);

  const hasFilter =
    Boolean(params.search) ||
    Boolean(params.category) ||
    Boolean(params.status);

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
        value={params.category ?? ALL}
        onValueChange={(value) =>
          setParams(
            {
              category: value === ALL ? undefined : (value as ProductCategory),
            },
            { resetPage: true },
          )
        }
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder={t("allCategories")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{t("allCategories")}</SelectItem>
          {categoryOptions.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={params.status ?? ALL}
        onValueChange={(value) =>
          setParams(
            {
              status:
                value === ALL ? undefined : (value as typeof params.status),
            },
            { resetPage: true },
          )
        }
      >
        <SelectTrigger className="w-[160px]">
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
              category: undefined,
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
