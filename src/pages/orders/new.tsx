import { useTranslation } from "react-i18next";

import { PageHeader } from "@/components/common/page-header";
import { OrderForm } from "@/components/features/orders/order-form";
import { useCreateOrder } from "@/hooks/orders/use-order-mutations";
import { pageTitle } from "@/i18n/meta";

export function meta() {
  return [{ title: pageTitle("orders:createPageTitle") }];
}

export default function NewOrderPage() {
  const { t } = useTranslation("orders");
  const { mutate, isPending } = useCreateOrder();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("createTitle")}
        description={t("createDescription")}
      />
      <OrderForm
        onSubmit={(values) => mutate(values)}
        isSubmitting={isPending}
      />
    </div>
  );
}
