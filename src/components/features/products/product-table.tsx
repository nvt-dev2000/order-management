import { Link } from "react-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { BaseTable, type BaseTableColumn } from "@/components/common";
import { useAppRoutes } from "@/hooks/use-app-routes";
import { useProductCategoryLabel } from "@/hooks/use-product-status";
import type { ProductCategory } from "@/constants/product-status";
import type { Product } from "@/types/products/product.types";
import { formatCurrency, formatNumber } from "@/utils/format";

import { ProductStatusBadge } from "@/components/features/products/product-status-badge";
import { useProductListParams } from "@/hooks/products/use-product-list-params";
import { useProducts } from "@/hooks/products/use-products";

function CategoryCell({ category }: { category: ProductCategory }) {
  const label = useProductCategoryLabel(category);
  return <span className="capitalize">{label}</span>;
}

export function ProductTable() {
  const { t } = useTranslation("products");
  const routes = useAppRoutes();
  const { params } = useProductListParams();
  const { data, isLoading, isError } = useProducts(params);

  const products = data?.data ?? [];

  const columns = useMemo<BaseTableColumn<Product>[]>(
    () => [
      {
        id: "sku",
        header: t("skuColumn"),
        cell: (product) => (
          <Link
            to={routes.products.detail(product.id)}
            className="text-primary font-medium hover:underline"
          >
            {product.sku}
          </Link>
        ),
      },
      {
        id: "name",
        header: t("nameColumn"),
        cell: (product) => product.name,
      },
      {
        id: "category",
        header: t("categoryColumn"),
        cell: (product) => (
          <CategoryCell category={product.category as ProductCategory} />
        ),
      },
      {
        id: "price",
        header: t("priceColumn"),
        headerClassName: "text-right",
        cellClassName: "text-right",
        cell: (product) => formatCurrency(product.price),
      },
      {
        id: "stock",
        header: t("stockColumn"),
        headerClassName: "text-right",
        cellClassName: "text-right",
        cell: (product) =>
          product.stock === 0 ? (
            <span className="text-destructive text-sm">{t("outOfStock")}</span>
          ) : (
            formatNumber(product.stock)
          ),
      },
      {
        id: "status",
        header: t("statusColumn"),
        cell: (product) => <ProductStatusBadge status={product.status} />,
      },
    ],
    [routes.products, t],
  );

  return (
    <BaseTable
      columns={columns}
      data={products}
      getRowKey={(product) => product.id}
      isLoading={isLoading}
      isError={isError}
      skeletonRows={8}
      emptyTitle={t("emptyTitle")}
      errorTitle={t("loadErrorTitle")}
      errorDescription={t("loadErrorDescription")}
    />
  );
}
