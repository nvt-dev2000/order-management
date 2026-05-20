import { Link, useParams } from "react-router";
import { useTranslation } from "react-i18next";

import { LoadingSpinner } from "@/components/common/loading-spinner";
import { PageHeader } from "@/components/common/page-header";
import { ProductForm } from "@/components/features/products/product-form";
import { Button } from "@/components/ui/button";
import type { ProductCategory } from "@/constants/product-status";
import { useAppRoutes } from "@/hooks/use-app-routes";
import { useUpdateProduct } from "@/hooks/products/use-product-mutations";
import { useProduct } from "@/hooks/products/use-product";
import { pageTitle } from "@/i18n/meta";

export function meta() {
  return [{ title: pageTitle("products:editPageTitle") }];
}

export default function EditProductPage() {
  const { t } = useTranslation(["products", "common"]);
  const routes = useAppRoutes();
  const { productId = "" } = useParams();
  const { data: product, isLoading, isError } = useProduct(productId);
  const { mutate, isPending } = useUpdateProduct(productId);

  if (isLoading) return <LoadingSpinner />;
  if (isError || !product) {
    return (
      <div className="space-y-4">
        <p className="text-destructive">{t("products:notFound")}</p>
        <Button variant="outline" asChild>
          <Link to={routes.products.list}>{t("common:backToList")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("products:editTitle")}
        description={t("products:editDescription")}
      />
      <ProductForm
        defaultValues={{
          sku: product.sku,
          name: product.name,
          category: product.category as ProductCategory,
          price: product.price,
          stock: product.stock,
          status: product.status,
          description: product.description ?? "",
        }}
        submitLabel={t("products:saveSubmit")}
        onSubmit={(values) => mutate(values)}
        isSubmitting={isPending}
      />
    </div>
  );
}
