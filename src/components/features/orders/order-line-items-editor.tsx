import { Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  useFieldArray,
  type Control,
  type FieldArrayWithId,
  type UseFormWatch,
} from "react-hook-form";

import { BaseTable, type BaseTableColumn } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
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
import { useProductsCatalog } from "@/hooks/products/use-products";
import type { CreateOrderInput } from "@/schemas/orders/order.schema";
import { formatCurrency } from "@/utils/format";

interface OrderLineItemsEditorProps {
  control: Control<CreateOrderInput>;
  watch: UseFormWatch<CreateOrderInput>;
}

type LineField = FieldArrayWithId<CreateOrderInput, "items", "id">;

export function OrderLineItemsEditor({
  control,
  watch,
}: OrderLineItemsEditorProps) {
  const { t } = useTranslation("orders");
  const { data: catalog, isLoading } = useProductsCatalog();
  const products = useMemo(() => catalog?.data ?? [], [catalog?.data]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items") ?? [];

  const estimatedTotal = items.reduce((sum, line) => {
    const product = products.find((p) => p.id === line.productId);
    if (!product || !line.quantity) return sum;
    return sum + product.price * Number(line.quantity);
  }, 0);

  const columns = useMemo<BaseTableColumn<LineField>[]>(
    () => [
      {
        id: "product",
        header: t("productColumn"),
        cell: (_field, index) => (
          <FormField
            control={control}
            name={`items.${index}.productId`}
            render={({ field: productField }) => (
              <FormItem>
                <Select
                  value={productField.value}
                  onValueChange={productField.onChange}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectProduct")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.sku} — {p.name} ({formatCurrency(p.price)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ),
      },
      {
        id: "quantity",
        header: t("quantityColumn"),
        headerClassName: "w-24",
        cell: (_field, index) => (
          <FormField
            control={control}
            name={`items.${index}.quantity`}
            render={({ field: qtyField }) => (
              <FormItem>
                <FormControl>
                  <Input type="number" min={1} step={1} {...qtyField} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ),
      },
      {
        id: "actions",
        header: "",
        headerClassName: "w-12",
        cell: (_field, index) => (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={fields.length <= 1}
            onClick={() => remove(index)}
            aria-label={t("deleteOrder")}
          >
            <Trash2 className="size-4" />
          </Button>
        ),
      },
    ],
    [control, fields.length, isLoading, products, remove, t],
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{t("orderItems")}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ productId: "", quantity: 1 })}
        >
          <Plus className="size-4" />
          {t("addLineItem")}
        </Button>
      </div>

      <BaseTable
        columns={columns}
        data={fields}
        getRowKey={(field) => field.id}
        hideEmptyState
        wrapperClassName="space-y-0"
      />

      <p className="text-muted-foreground text-right text-sm">
        {t("orderTotal")}: {formatCurrency(estimatedTotal)}
      </p>
    </div>
  );
}
