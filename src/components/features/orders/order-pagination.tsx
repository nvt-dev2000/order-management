import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

interface OrderPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function OrderPagination({
  page,
  totalPages,
  total,
  onPageChange,
}: OrderPaginationProps) {
  const { t } = useTranslation("orders");

  if (totalPages <= 1) {
    return (
      <p className="text-muted-foreground text-sm">
        {t("totalOrders", { total })}
      </p>
    );
  }

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex items-center justify-between">
      <p className="text-muted-foreground text-sm">
        {t("pageInfo", { page, totalPages, total })}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!canPrev}
          onClick={() => onPageChange(page - 1)}
          aria-label={t("prevPageAria")}
        >
          <ChevronLeft className="size-4" />
          {t("prevPage")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!canNext}
          onClick={() => onPageChange(page + 1)}
          aria-label={t("nextPageAria")}
        >
          {t("nextPage")}
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
