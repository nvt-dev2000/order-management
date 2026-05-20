import { useTranslation } from "react-i18next";

import { PageHeader } from "@/components/common/page-header";
import { ReturnForm } from "@/components/features/returns/return-form";
import { useCreateReturn } from "@/hooks/returns/use-return-mutations";
import { pageTitle } from "@/i18n/meta";

export function meta() {
  return [{ title: pageTitle("returns:createPageTitle") }];
}

export default function NewReturnPage() {
  const { t } = useTranslation("returns");
  const { mutate, isPending } = useCreateReturn();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("createTitle")}
        description={t("createDescription")}
      />
      <ReturnForm
        onSubmit={(values) => mutate(values)}
        isSubmitting={isPending}
      />
    </div>
  );
}
