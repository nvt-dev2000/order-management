import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { PageHeader } from "@/components/common/page-header";
import { useAppRoutes } from "@/hooks/use-app-routes";
import { Button } from "@/components/ui/button";
import { OrderFilters } from "@/components/features/orders/order-filters";
import { OrderTable } from "@/components/features/orders/order-table";
import { pageTitle } from "@/i18n/meta";

export function meta() {
  return [{ title: pageTitle("orders:title") }];
}

export default function OrdersListPage() {
  const { t } = useTranslation("orders");
  const routes = useAppRoutes();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("listDescription")}
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link to={routes.history}>{t("historyTitle")}</Link>
            </Button>
            <Button asChild>
              <Link to={routes.orders.new}>{t("createNew")}</Link>
            </Button>
          </div>
        }
      />
      <OrderFilters />
      <OrderTable />
    </div>
  );
}
