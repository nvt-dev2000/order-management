import { Inbox } from "lucide-react";
import { useTranslation } from "react-i18next";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  const { t } = useTranslation("common");

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <Inbox className="text-muted-foreground size-10" />
      <p className="font-medium">{title ?? t("noData")}</p>
      <p className="text-muted-foreground text-sm">
        {description ?? t("noRecordsDescription")}
      </p>
    </div>
  );
}
