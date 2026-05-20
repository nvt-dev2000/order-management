import { Badge } from "@/components/ui/badge";

import type { OrderStatus } from "@/constants/order-status";
import { useOrderStatusLabel } from "@/hooks/use-order-status";

const statusVariant: Record<
  OrderStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "outline",
  confirmed: "secondary",
  shipping: "default",
  delivered: "default",
  cancelled: "destructive",
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const label = useOrderStatusLabel(status);

  return <Badge variant={statusVariant[status]}>{label}</Badge>;
}
