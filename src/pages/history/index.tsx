import { useTranslation } from "react-i18next";

import { PageHeader } from "@/components/common/page-header";
import { HistoryFilters } from "@/components/features/history/history-filters";
import { HistoryTimeline } from "@/components/features/history/history-timeline";
import { pageTitle } from "@/i18n/meta";

export function meta() {
  return [{ title: pageTitle("orders:historyPageTitle") }];
}

export default function HistoryPage() {
  const { t } = useTranslation("orders");

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("historyTitle")}
        description={t("historyDescription")}
      />
      <HistoryFilters />
      <HistoryTimeline />
    </div>
  );
}
