import { Link } from "react-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { BaseTable, type BaseTableColumn } from "@/components/common";
import { useAppRoutes } from "@/hooks/use-app-routes";
import { formatCurrency, formatDate } from "@/utils/format";

import { ReturnStatusBadge } from "@/components/features/returns/return-status-badge";
import { useReturnListParams } from "@/hooks/returns/use-return-list-params";
import { useReturns } from "@/hooks/returns/use-returns";
import type { ReturnRequest } from "@/types/returns/return.types";

export function ReturnTable() {
  const { t } = useTranslation("returns");
  const routes = useAppRoutes();
  const { params } = useReturnListParams();
  const { data, isLoading, isError } = useReturns(params);

  const returns = data?.data ?? [];

  const columns = useMemo<BaseTableColumn<ReturnRequest>[]>(
    () => [
      {
        id: "returnNumber",
        header: t("returnCode"),
        cell: (item) => (
          <Link
            to={routes.returns.detail(item.id)}
            className="text-primary font-medium hover:underline"
          >
            {item.returnNumber}
          </Link>
        ),
      },
      {
        id: "orderNumber",
        header: t("orderCode"),
        cell: (item) => (
          <Link
            to={routes.orders.detail(item.orderId)}
            className="hover:underline"
          >
            {item.orderNumber}
          </Link>
        ),
      },
      {
        id: "customer",
        header: t("customerColumn"),
        cell: (item) => (
          <>
            <p className="font-medium">{item.customerName}</p>
            <p className="text-muted-foreground text-xs">
              {item.customerEmail}
            </p>
          </>
        ),
      },
      {
        id: "reason",
        header: t("reasonColumn"),
        cellClassName: "max-w-[200px] truncate",
        cell: (item) => <span title={item.reason}>{item.reason}</span>,
      },
      {
        id: "status",
        header: t("statusColumn"),
        cell: (item) => <ReturnStatusBadge status={item.status} />,
      },
      {
        id: "refund",
        header: t("refundColumn"),
        headerClassName: "text-right",
        cellClassName: "text-right",
        cell: (item) => formatCurrency(item.refundAmount),
      },
      {
        id: "createdAt",
        header: t("createdColumn"),
        cell: (item) => formatDate(item.createdAt),
      },
    ],
    [routes.orders, routes.returns, t],
  );

  return (
    <BaseTable
      columns={columns}
      data={returns}
      getRowKey={(item) => item.id}
      isLoading={isLoading}
      isError={isError}
      skeletonRows={6}
      emptyTitle={t("emptyTitle")}
      errorTitle={t("loadErrorTitle")}
      errorDescription={t("loadErrorDescription")}
    />
  );
}
