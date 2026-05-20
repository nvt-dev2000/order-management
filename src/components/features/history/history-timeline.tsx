import { Link } from "react-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { EmptyState, LoadingSpinner } from "@/components/common";
import { OrderStatusBadge } from "@/components/features/orders/order-status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAppRoutes } from "@/hooks/use-app-routes";
import { useHistoryParams } from "@/hooks/history/use-history-params";
import { useOrders } from "@/hooks/orders/use-orders";
import { filterOrdersByHistoryTab, groupOrdersByDate } from "@/utils/history";
import { formatCurrency, formatDate } from "@/utils/format";

const HISTORY_FETCH_LIMIT = 100;

export function HistoryTimeline() {
  const { t } = useTranslation("orders");
  const routes = useAppRoutes();
  const { params } = useHistoryParams();
  const { data, isLoading, isError } = useOrders({
    limit: HISTORY_FETCH_LIMIT,
    search: params.search,
  });

  const filteredOrders = useMemo(() => {
    const list = data?.data ?? [];
    return filterOrdersByHistoryTab(list, params.tab);
  }, [data?.data, params.tab]);

  const groups = useMemo(
    () => groupOrdersByDate(filteredOrders, t),
    [filteredOrders, t],
  );

  if (isLoading) return <LoadingSpinner />;
  if (isError) {
    return (
      <EmptyState
        title={t("loadErrorTitle")}
        description={t("loadErrorDescription")}
      />
    );
  }

  if (filteredOrders.length === 0) {
    return <EmptyState title={t("historyEmptyTitle")} />;
  }

  return (
    <div className="space-y-8">
      <p className="text-muted-foreground text-sm">
        {t("historySummary", { count: filteredOrders.length })}
      </p>

      {groups.map((group) => (
        <section key={group.label} className="space-y-3">
          <h2 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
            {group.label}
          </h2>
          <ul className="space-y-3">
            {group.orders.map((order) => (
              <li key={order.id}>
                <Card className="hover:bg-muted/40 transition-colors">
                  <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
                    <div className="min-w-0 space-y-1">
                      <Link
                        to={routes.orders.detail(order.id)}
                        className="text-primary font-semibold hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                      <p className="text-sm">
                        {order.customerName}
                        <span className="text-muted-foreground">
                          {" "}
                          · {order.customerEmail}
                        </span>
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {formatDate(order.createdAt)} · {order.itemsCount}{" "}
                        {t("itemsCountLabel").toLowerCase()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
                      <OrderStatusBadge status={order.status} />
                      <span className="font-semibold">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
