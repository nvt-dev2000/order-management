import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  useFieldArray,
  type Control,
  type FieldArrayWithId,
} from "react-hook-form";

import { BaseTable, type BaseTableColumn } from "@/components/common";
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
import type { OrderLineItem } from "@/types/orders/order.types";
import type { CreateReturnInput } from "@/schemas/returns/return.schema";
import { formatCurrency } from "@/utils/format";

interface ReturnLineItemsEditorProps {
  control: Control<CreateReturnInput>;
  orderItems: OrderLineItem[];
}

type LineField = FieldArrayWithId<CreateReturnInput, "items", "id">;

type ReturnLineRow = {
  field: LineField;
  index: number;
  orderLine: OrderLineItem;
};

export function ReturnLineItemsEditor({
  control,
  orderItems,
}: ReturnLineItemsEditorProps) {
  const { t } = useTranslation("returns");
  const { fields } = useFieldArray({ control, name: "items" });

  const rows = useMemo(
    () =>
      fields.flatMap((field, index) => {
        const orderLine = orderItems[index];
        if (!orderLine) return [];
        return [{ field, index, orderLine }];
      }),
    [fields, orderItems],
  );

  const columns = useMemo<BaseTableColumn<ReturnLineRow>[]>(
    () => [
      {
        id: "product",
        header: t("productColumn"),
        cell: (row) => (
          <FormField
            control={control}
            name={`items.${row.index}.productId`}
            render={({ field: productField }) => (
              <FormItem>
                <Select
                  value={productField.value}
                  onValueChange={productField.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {orderItems.map((line) => (
                      <SelectItem key={line.productId} value={line.productId}>
                        {line.sku} — {line.productName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        ),
      },
      {
        id: "quantity",
        header: t("quantityColumn"),
        headerClassName: "w-28",
        cell: (row) => (
          <FormField
            control={control}
            name={`items.${row.index}.quantity`}
            render={({ field: qtyField }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={row.orderLine.quantity}
                    step={1}
                    {...qtyField}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ),
      },
      {
        id: "maxQty",
        header: t("maxQty"),
        headerClassName: "text-right",
        cellClassName: "text-muted-foreground text-right text-sm",
        cell: (row) => (
          <>
            {row.orderLine.quantity} · {formatCurrency(row.orderLine.unitPrice)}
          </>
        ),
      },
    ],
    [control, orderItems, t],
  );

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{t("returnItems")}</p>
      <BaseTable
        columns={columns}
        data={rows}
        getRowKey={(row) => row.field.id}
        hideEmptyState
        wrapperClassName="space-y-0"
      />
    </div>
  );
}
