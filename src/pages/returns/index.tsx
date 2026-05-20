import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { PageHeader } from "@/components/common/page-header";
import { ReturnFilters } from "@/components/features/returns/return-filters";
import { ReturnTable } from "@/components/features/returns/return-table";
import { Button } from "@/components/ui/button";
import { useAppRoutes } from "@/hooks/use-app-routes";
import { pageTitle } from "@/i18n/meta";

export function meta() {
  return [{ title: pageTitle("returns:title") }];
}

export default function ReturnsListPage() {
  const { t } = useTranslation("returns");
  const routes = useAppRoutes();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("listDescription")}
        action={
          <Button asChild>
            <Link to={routes.returns.new}>{t("createNew")}</Link>
          </Button>
        }
      />
      <ReturnFilters />
      <ReturnTable />
    </div>
  );
}
