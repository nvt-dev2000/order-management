import { Link, useParams } from "react-router";
import { useTranslation } from "react-i18next";

import { LoadingSpinner } from "@/components/common/loading-spinner";
import { useAppRoutes } from "@/hooks/use-app-routes";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/utils/format";
import { OrderLineItemsTable } from "@/components/features/orders/order-line-items-table";
import { OrderStatusBadge } from "@/components/features/orders/order-status-badge";
import { useDeleteOrder } from "@/hooks/orders/use-order-mutations";
import { useOrder } from "@/hooks/orders/use-order";
import { pageTitle } from "@/i18n/meta";

export function meta() {
  return [{ title: pageTitle("orders:detailPageTitle") }];
}

export default function OrderDetailPage() {
  const { t } = useTranslation(["orders", "common"]);
  const routes = useAppRoutes();
  const { orderId = "" } = useParams();
  const { data: order, isLoading, isError } = useOrder(orderId);
  const { mutate: deleteOrder, isPending: isDeleting } = useDeleteOrder();

  if (isLoading) return <LoadingSpinner />;
  if (isError || !order) {
    return (
      <div className="space-y-4">
        <p className="text-destructive">{t("orders:notFound")}</p>
        <Button variant="outline" asChild>
          <Link to={routes.orders.list}>{t("common:backToList")}</Link>
        </Button>
      </div>
    );
  }

  const handleDelete = () => {
    if (
      !window.confirm(
        t("orders:confirmDelete", { orderNumber: order.orderNumber }),
      )
    )
      return;
    deleteOrder(order.id);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("orders:detailTitle", { orderNumber: order.orderNumber })}
        action={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to={routes.orders.list}>{t("common:back")}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to={routes.orders.edit(order.id)}>
                {t("orders:editOrder")}
              </Link>
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? t("common:deleting") : t("orders:deleteOrder")}
            </Button>
          </div>
        }
      />
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {t("orders:orderInfo")}
            <OrderStatusBadge status={order.status} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm">
          <div className="space-y-2">
            <p>
              <span className="text-muted-foreground">
                {t("orders:customer")}{" "}
              </span>
              {order.customerName} ({order.customerEmail})
            </p>
            <p>
              <span className="text-muted-foreground">
                {t("orders:itemsCount")}{" "}
              </span>
              {order.itemsCount}
            </p>
            <p>
              <span className="text-muted-foreground">
                {t("orders:createdAt")}{" "}
              </span>
              {formatDate(order.createdAt)}
            </p>
          </div>
          <OrderLineItemsTable
            items={order.items}
            showTotal
            totalAmount={order.totalAmount}
          />
        </CardContent>
      </Card>
    </div>
  );
}
