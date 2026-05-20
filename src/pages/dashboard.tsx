import { useTranslation } from "react-i18next";

import { PageHeader } from "@/components/common/page-header";
import { StatsCards } from "@/components/features/dashboard/stats-cards";
import { pageTitle } from "@/i18n/meta";

export function meta() {
  return [{ title: pageTitle("dashboard:pageTitle") }];
}

export default function DashboardPage() {
  const { t } = useTranslation("dashboard");

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />
      <StatsCards />
    </div>
  );
}
