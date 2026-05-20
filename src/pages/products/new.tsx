import { useTranslation } from "react-i18next";

import { PageHeader } from "@/components/common/page-header";
import { ProductForm } from "@/components/features/products/product-form";
import { useCreateProduct } from "@/hooks/products/use-product-mutations";
import { pageTitle } from "@/i18n/meta";

export function meta() {
  return [{ title: pageTitle("products:createPageTitle") }];
}

export default function NewProductPage() {
  const { t } = useTranslation("products");
  const { mutate, isPending } = useCreateProduct();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("createTitle")}
        description={t("createDescription")}
      />
      <ProductForm
        onSubmit={(values) => mutate(values)}
        isSubmitting={isPending}
      />
    </div>
  );
}
