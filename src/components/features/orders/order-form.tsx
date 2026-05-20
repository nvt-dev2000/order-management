import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm, type DefaultValues } from "react-hook-form";
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
import { ORDER_STATUS, type OrderStatus } from "@/constants/order-status";
import { useOrderStatusOptions } from "@/hooks/use-order-status";
import {
  createOrderSchema,
  type CreateOrderInput,
} from "@/schemas/orders/order.schema";

import { OrderLineItemsEditor } from "@/components/features/orders/order-line-items-editor";

interface OrderFormProps {
  defaultValues?: Partial<CreateOrderInput>;
  submitLabel?: string;
  onSubmit: (values: CreateOrderInput) => void;
  isSubmitting?: boolean;
}

const defaultInitial: DefaultValues<CreateOrderInput> = {
  customerName: "",
  customerEmail: "",
  status: ORDER_STATUS.PENDING,
  items: [{ productId: "", quantity: 1 }],
};

export function OrderForm({
  defaultValues,
  submitLabel,
  onSubmit,
  isSubmitting = false,
}: OrderFormProps) {
  const { t, i18n } = useTranslation(["orders", "common"]);
  const statusOptions = useOrderStatusOptions();

  const schema = useMemo(
    () => createOrderSchema(i18n.getFixedT(null, "validation")),
    [i18n],
  );

  const form = useForm<CreateOrderInput>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultInitial, ...defaultValues },
  });

  const resolvedSubmitLabel = submitLabel ?? t("createSubmit");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-3xl space-y-6"
        noValidate
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("customerName")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("customerNamePlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common:email")}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="customer@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="max-w-xs">
              <FormLabel>{t("statusLabel")}</FormLabel>
              <Select
                value={field.value}
                onValueChange={(value) => field.onChange(value as OrderStatus)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectStatus")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statusOptions.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <OrderLineItemsEditor control={form.control} watch={form.watch} />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("common:saving") : resolvedSubmitLabel}
        </Button>
      </form>
    </Form>
  );
}
