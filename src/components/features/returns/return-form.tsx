import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORDER_STATUS } from "@/constants/order-status";
import { useOrders } from "@/hooks/orders/use-orders";
import {
  createReturnSchema,
  type CreateReturnInput,
} from "@/schemas/returns/return.schema";
import { formatCurrency } from "@/utils/format";

import { ReturnLineItemsEditor } from "@/components/features/returns/return-line-items-editor";

const defaultInitial: CreateReturnInput = {
  orderId: "",
  reason: "",
  items: [{ productId: "", quantity: 1 }],
};

export function ReturnForm({
  onSubmit,
  isSubmitting = false,
}: {
  onSubmit: (values: CreateReturnInput) => void;
  isSubmitting?: boolean;
}) {
  const { t, i18n } = useTranslation(["returns", "common"]);
  const { data: ordersData, isLoading: ordersLoading } = useOrders({
    limit: 100,
  });

  const deliveredOrders = useMemo(
    () =>
      (ordersData?.data ?? []).filter(
        (o) => o.status === ORDER_STATUS.DELIVERED,
      ),
    [ordersData?.data],
  );

  const schema = useMemo(
    () => createReturnSchema(i18n.getFixedT(null, "validation")),
    [i18n],
  );

  const form = useForm<CreateReturnInput>({
    resolver: zodResolver(schema),
    defaultValues: defaultInitial,
  });

  const orderId = form.watch("orderId");
  const selectedOrder = deliveredOrders.find((o) => o.id === orderId);

  useEffect(() => {
    if (!selectedOrder) return;
    form.setValue(
      "items",
      selectedOrder.items.map((item) => ({
        productId: item.productId,
        quantity: 1,
      })),
    );
  }, [selectedOrder, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-3xl space-y-6"
        noValidate
      >
        <FormField
          control={form.control}
          name="orderId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("orderSelect")}</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={ordersLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectOrder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {deliveredOrders.map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      {order.orderNumber} — {order.customerName} (
                      {formatCurrency(order.totalAmount)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
              {deliveredOrders.length === 0 && !ordersLoading && (
                <p className="text-muted-foreground text-xs">
                  {t("noDeliveredOrders")}
                </p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("reason")}</FormLabel>
              <FormControl>
                <Input placeholder={t("reasonPlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedOrder && (
          <ReturnLineItemsEditor
            control={form.control}
            orderItems={selectedOrder.items}
          />
        )}

        <Button type="submit" disabled={isSubmitting || !selectedOrder}>
          {isSubmitting ? t("common:saving") : t("createSubmit")}
        </Button>
      </form>
    </Form>
  );
}
