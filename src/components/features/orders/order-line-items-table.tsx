import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { BaseTable, type BaseTableColumn } from "@/components/common";
import type { OrderLineItem } from "@/types/orders/order.types";
import { formatCurrency } from "@/utils/format";

interface OrderLineItemsTableProps {
  items: OrderLineItem[];
  showTotal?: boolean;
  totalAmount?: number;
}

export function OrderLineItemsTable({
  items,
  showTotal = false,
  totalAmount,
}: OrderLineItemsTableProps) {
  const { t } = useTranslation("orders");

  const columns = useMemo<BaseTableColumn<OrderLineItem>[]>(
    () => [
      {
        id: "product",
        header: t("productColumn"),
        cell: (item) => (
          <>
            <p className="font-medium">{item.productName}</p>
            <p className="text-muted-foreground text-xs">{item.sku}</p>
          </>
        ),
      },
      {
        id: "quantity",
        header: t("quantityColumn"),
        headerClassName: "text-right",
        cellClassName: "text-right",
        cell: (item) => item.quantity,
      },
      {
        id: "unitPrice",
        header: t("unitPriceColumn"),
        headerClassName: "text-right",
        cellClassName: "text-right",
        cell: (item) => formatCurrency(item.unitPrice),
      },
      {
        id: "lineTotal",
        header: t("lineTotalColumn"),
        headerClassName: "text-right",
        cellClassName: "text-right",
        cell: (item) => formatCurrency(item.lineTotal),
      },
    ],
    [t],
  );

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{t("orderItems")}</p>
      <BaseTable
        columns={columns}
        data={items}
        getRowKey={(item) => `${item.productId}-${item.sku}`}
        hideEmptyState
      />
      {showTotal && totalAmount !== undefined && (
        <p className="text-right text-sm font-semibold">
          {t("orderTotal")}: {formatCurrency(totalAmount)}
        </p>
      )}
    </div>
  );
}
