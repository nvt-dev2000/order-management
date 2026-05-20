import { Link, useParams } from "react-router";
import { useTranslation } from "react-i18next";

import { LoadingSpinner } from "@/components/common/loading-spinner";
import { PageHeader } from "@/components/common/page-header";
import { ReturnLineItemsTable } from "@/components/features/returns/return-line-items-table";
import { ReturnStatusBadge } from "@/components/features/returns/return-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RETURN_STATUS } from "@/constants/return-status";
import { useAppRoutes } from "@/hooks/use-app-routes";
import { useUpdateReturnStatus } from "@/hooks/returns/use-return-mutations";
import { useReturn } from "@/hooks/returns/use-return";
import { pageTitle } from "@/i18n/meta";
import { formatDate } from "@/utils/format";

export function meta() {
  return [{ title: pageTitle("returns:detailPageTitle") }];
}

export default function ReturnDetailPage() {
  const { t } = useTranslation(["returns", "common"]);
  const routes = useAppRoutes();
  const { returnId = "" } = useParams();
  const { data: item, isLoading, isError } = useReturn(returnId);
  const { mutate: updateStatus, isPending } = useUpdateReturnStatus(returnId);

  if (isLoading) return <LoadingSpinner />;
  if (isError || !item) {
    return (
      <div className="space-y-4">
        <p className="text-destructive">{t("returns:notFound")}</p>
        <Button variant="outline" asChild>
          <Link to={routes.returns.list}>{t("common:backToList")}</Link>
        </Button>
      </div>
    );
  }

  const canApprove = item.status === RETURN_STATUS.PENDING;
  const canRefund = item.status === RETURN_STATUS.APPROVED;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("returns:detailTitle", { returnNumber: item.returnNumber })}
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link to={routes.returns.list}>{t("common:back")}</Link>
            </Button>
            {canApprove && (
              <>
                <Button
                  variant="default"
                  disabled={isPending}
                  onClick={() =>
                    updateStatus({ status: RETURN_STATUS.APPROVED })
                  }
                >
                  {t("returns:approve")}
                </Button>
                <Button
                  variant="destructive"
                  disabled={isPending}
                  onClick={() =>
                    updateStatus({ status: RETURN_STATUS.REJECTED })
                  }
                >
                  {t("returns:reject")}
                </Button>
              </>
            )}
            {canRefund && (
              <Button
                disabled={isPending}
                onClick={() => updateStatus({ status: RETURN_STATUS.REFUNDED })}
              >
                {t("returns:markRefunded")}
              </Button>
            )}
          </div>
        }
      />

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            {t("returns:returnInfo")}
            <ReturnStatusBadge status={item.status} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm">
          <div className="space-y-2">
            <p>
              <span className="text-muted-foreground">
                {t("returns:orderCode")}:{" "}
              </span>
              <Link
                to={routes.orders.detail(item.orderId)}
                className="text-primary hover:underline"
              >
                {item.orderNumber}
              </Link>
            </p>
            <p>
              <span className="text-muted-foreground">
                {t("returns:customer")}:{" "}
              </span>
              {item.customerName} ({item.customerEmail})
            </p>
            <p>
              <span className="text-muted-foreground">
                {t("returns:reason")}:{" "}
              </span>
              {item.reason}
            </p>
            <p>
              <span className="text-muted-foreground">
                {t("returns:createdAt")}:{" "}
              </span>
              {formatDate(item.createdAt)}
            </p>
          </div>
          <ReturnLineItemsTable
            items={item.items}
            refundAmount={item.refundAmount}
          />
        </CardContent>
      </Card>
    </div>
  );
}
