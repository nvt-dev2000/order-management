import { Link, useParams } from "react-router";
import { useTranslation } from "react-i18next";

import { LoadingSpinner } from "@/components/common/loading-spinner";
import { PageHeader } from "@/components/common/page-header";
import { OrderForm } from "@/components/features/orders/order-form";
import { Button } from "@/components/ui/button";
import { useAppRoutes } from "@/hooks/use-app-routes";
import { useUpdateOrder } from "@/hooks/orders/use-order-mutations";
import { useOrder } from "@/hooks/orders/use-order";
import { pageTitle } from "@/i18n/meta";

export function meta() {
  return [{ title: pageTitle("orders:editPageTitle") }];
}

export default function OrderEditPage() {
  const { t } = useTranslation(["orders", "common"]);
  const routes = useAppRoutes();
  const { orderId = "" } = useParams();
  const { data: order, isLoading, isError } = useOrder(orderId);
  const { mutate, isPending } = useUpdateOrder(orderId);

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

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("orders:editTitle")}
        description={t("orders:editDescription")}
      />
      <OrderForm
        defaultValues={{
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          status: order.status,
          items: order.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }}
        submitLabel={t("orders:saveSubmit")}
        onSubmit={(values) => mutate(values)}
        isSubmitting={isPending}
      />
    </div>
  );
}
