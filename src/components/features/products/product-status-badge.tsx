import { Badge } from "@/components/ui/badge";
import type { ProductStatus } from "@/constants/product-status";
import { useProductStatusLabel } from "@/hooks/use-product-status";

const statusVariant: Record<
  ProductStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "default",
  inactive: "secondary",
};

interface ProductStatusBadgeProps {
  status: ProductStatus;
}

export function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  const label = useProductStatusLabel(status);
  return <Badge variant={statusVariant[status]}>{label}</Badge>;
}
