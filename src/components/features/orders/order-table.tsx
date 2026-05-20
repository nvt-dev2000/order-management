import { Link } from "react-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { BaseTable, type BaseTableColumn } from "@/components/common";
import { useAppRoutes } from "@/hooks/use-app-routes";
import { formatCurrency, formatDate } from "@/utils/format";

import { OrderStatusBadge } from "@/components/features/orders/order-status-badge";
import { OrderPagination } from "@/components/features/orders/order-pagination";
import { useOrderListParams } from "@/hooks/orders/use-order-list-params";
import { useOrders } from "@/hooks/orders/use-orders";
import type { Order } from "@/types/orders/order.types";

export function OrderTable() {
  const { t } = useTranslation("orders");
  const routes = useAppRoutes();
  const { params, setParams } = useOrderListParams();
  const { data, isLoading, isError } = useOrders(params);

  const orders = data?.data ?? [];
  const meta = data?.meta;

  const columns = useMemo<BaseTableColumn<Order>[]>(
    () => [
      {
        id: "orderNumber",
        header: t("orderCode"),
        cell: (order) => (
          <Link
            to={routes.orders.detail(order.id)}
            className="text-primary font-medium hover:underline"
          >
            {order.orderNumber}
          </Link>
        ),
      },
      {
        id: "customer",
        header: t("customerColumn"),
        cell: (order) => (
          <div>
            <p className="font-medium">{order.customerName}</p>
            <p className="text-muted-foreground text-xs">
              {order.customerEmail}
            </p>
          </div>
        ),
      },
      {
        id: "status",
        header: t("statusColumn"),
        cell: (order) => <OrderStatusBadge status={order.status} />,
      },
      {
        id: "itemsCount",
        header: t("itemsCountLabel"),
        headerClassName: "text-right",
        cellClassName: "text-right",
        cell: (order) => order.itemsCount,
      },
      {
        id: "total",
        header: t("totalColumn"),
        headerClassName: "text-right",
        cellClassName: "text-right",
        cell: (order) => formatCurrency(order.totalAmount),
      },
      {
        id: "createdAt",
        header: t("createdColumn"),
        cell: (order) => formatDate(order.createdAt),
      },
    ],
    [routes.orders, t],
  );

  return (
    <BaseTable
      columns={columns}
      data={orders}
      getRowKey={(order) => order.id}
      isLoading={isLoading}
      isError={isError}
      skeletonRows={6}
      emptyTitle={t("emptyTitle")}
      errorTitle={t("loadErrorTitle")}
      errorDescription={t("loadErrorDescription")}
      footer={
        meta ? (
          <OrderPagination
            page={meta.page}
            totalPages={meta.totalPages}
            total={meta.total}
            onPageChange={(page) => setParams({ page })}
          />
        ) : undefined
      }
    />
  );
}
