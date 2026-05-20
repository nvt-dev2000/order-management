import { DollarSign, Package, Users, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/format";

import { useDashboardStats } from "@/hooks/dashboard/use-dashboard-stats";

const statKeys = [
  {
    key: "totalOrders" as const,
    icon: Package,
    format: (v: number) => String(v),
  },
  {
    key: "pendingOrders" as const,
    icon: Clock,
    format: (v: number) => String(v),
  },
  {
    key: "revenue" as const,
    icon: DollarSign,
    format: (v: number) => formatCurrency(v),
  },
  { key: "customers" as const, icon: Users, format: (v: number) => String(v) },
];

export function StatsCards() {
  const { t } = useTranslation("dashboard");
  const { data, isLoading, isError } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  if (isError || !data) {
    return <p className="text-muted-foreground text-sm">{t("loadError")}</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statKeys.map(({ key, icon: Icon, format }) => (
        <Card key={key}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t(key)}</CardTitle>
            <Icon className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{format(data[key])}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
