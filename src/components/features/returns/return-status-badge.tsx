import { Badge } from "@/components/ui/badge";
import type { ReturnStatus } from "@/constants/return-status";
import { useReturnStatusLabel } from "@/hooks/use-return-status";

const statusVariant: Record<
  ReturnStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "outline",
  approved: "secondary",
  rejected: "destructive",
  refunded: "default",
};

interface ReturnStatusBadgeProps {
  status: ReturnStatus;
}

export function ReturnStatusBadge({ status }: ReturnStatusBadgeProps) {
  const label = useReturnStatusLabel(status);
  return <Badge variant={statusVariant[status]}>{label}</Badge>;
}
