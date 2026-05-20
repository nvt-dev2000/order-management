import { Link, useParams } from "react-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { BaseTable, type BaseTableColumn } from "@/components/common";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { PageHeader } from "@/components/common/page-header";
import { ProductStatusBadge } from "@/components/features/products/product-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppRoutes } from "@/hooks/use-app-routes";
import type { Order } from "@/types/orders/order.types";
import { useProductCategoryLabel } from "@/hooks/use-product-status";
import type { ProductCategory } from "@/constants/product-status";
import { useDeleteProduct } from "@/hooks/products/use-product-mutations";
import { useProduct } from "@/hooks/products/use-product";
import { useOrders } from "@/hooks/orders/use-orders";
import { pageTitle } from "@/i18n/meta";
import { formatCurrency, formatDate, formatNumber } from "@/utils/format";

export function meta() {
  return [{ title: pageTitle("products:detailPageTitle") }];
}

export default function ProductDetailPage() {
  const { t } = useTranslation(["products", "common", "orders"]);
  const routes = useAppRoutes();
  const { productId = "" } = useParams();
  const { data: product, isLoading, isError } = useProduct(productId);
  const { data: ordersData } = useOrders({ limit: 100 });
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const categoryLabel = useProductCategoryLabel(
    (product?.category ?? "electronics") as ProductCategory,
  );

  const relatedOrders = useMemo(
    () =>
      product
        ? (ordersData?.data.filter((o) =>
            o.items.some((item) => item.productId === product.id),
          ) ?? [])
        : [],
    [ordersData?.data, product],
  );

  const relatedOrderColumns = useMemo<BaseTableColumn<Order>[]>(
    () => [
      {
        id: "orderNumber",
        header: t("orders:orderCode"),
        cell: (order) => (
          <Link
            to={routes.orders.detail(order.id)}
            className="text-primary hover:underline"
          >
            {order.orderNumber}
          </Link>
        ),
      },
      {
        id: "customer",
        header: t("orders:customerColumn"),
        cell: (order) => order.customerName,
      },
      {
        id: "total",
        header: t("orders:totalColumn"),
        cell: (order) => formatCurrency(order.totalAmount),
      },
    ],
    [routes.orders, t],
  );

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

  const handleDelete = () => {
    if (!window.confirm(t("products:confirmDelete", { name: product.name })))
      return;
    deleteProduct(product.id);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("products:detailTitle", { name: product.name })}
        action={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to={routes.products.list}>{t("common:back")}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to={routes.products.edit(product.id)}>
                {t("common:edit")}
              </Link>
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? t("common:deleting") : t("products:deleteProduct")}
            </Button>
          </div>
        }
      />

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {t("products:productInfo")}
            <ProductStatusBadge status={product.status} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">{t("products:sku")}: </span>
            {product.sku}
          </p>
          <p>
            <span className="text-muted-foreground">
              {t("products:category")}:{" "}
            </span>
            {categoryLabel}
          </p>
          <p>
            <span className="text-muted-foreground">
              {t("products:price")}:{" "}
            </span>
            {formatCurrency(product.price)}
          </p>
          <p>
            <span className="text-muted-foreground">
              {t("products:stock")}:{" "}
            </span>
            {product.stock === 0
              ? t("products:outOfStock")
              : formatNumber(product.stock)}
          </p>
          {product.description && (
            <p>
              <span className="text-muted-foreground">
                {t("products:description")}:{" "}
              </span>
              {product.description}
            </p>
          )}
          <p>
            <span className="text-muted-foreground">
              {t("orders:createdAt")}{" "}
            </span>
            {formatDate(product.createdAt)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t("products:relatedOrders")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {relatedOrders.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              {t("products:noRelatedOrders")}
            </p>
          ) : (
            <BaseTable
              columns={relatedOrderColumns}
              data={relatedOrders}
              getRowKey={(order) => order.id}
              hideEmptyState
              wrapperClassName="space-y-0"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
