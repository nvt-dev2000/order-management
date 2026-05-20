import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { PageHeader } from "@/components/common/page-header";
import { ProductFilters } from "@/components/features/products/product-filters";
import { ProductTable } from "@/components/features/products/product-table";
import { Button } from "@/components/ui/button";
import { useAppRoutes } from "@/hooks/use-app-routes";
import { pageTitle } from "@/i18n/meta";

export function meta() {
  return [{ title: pageTitle("products:title") }];
}

export default function ProductsListPage() {
  const { t } = useTranslation("products");
  const routes = useAppRoutes();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("listDescription")}
        action={
          <Button asChild>
            <Link to={routes.products.new}>{t("createNew")}</Link>
          </Button>
        }
      />
      <ProductFilters />
      <ProductTable />
    </div>
  );
}
