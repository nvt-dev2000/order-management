import type { TFunction } from "i18next";
import { z } from "zod";

import { PAGINATION } from "@/constants";
import { ORDER_STATUS } from "@/constants/order-status";

const orderStatusSchema = z.enum([
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.SHIPPING,
  ORDER_STATUS.DELIVERED,
  ORDER_STATUS.CANCELLED,
]);

const orderLineItemInputSchema = (t: TFunction<"validation">) =>
  z.object({
    productId: z.string().min(1, t("productRequired")),
    quantity: z.coerce.number().int(t("quantityInt")).min(1, t("quantityMin")),
  });

export const createOrderSchema = (t: TFunction<"validation">) =>
  z.object({
    customerName: z.string().trim().min(1, t("customerNameRequired")),
    customerEmail: z.string().trim().email(t("emailInvalid")),
    status: orderStatusSchema,
    items: z.array(orderLineItemInputSchema(t)).min(1, t("orderItemsMin")),
  });

export const createUpdateOrderSchema = (t: TFunction<"validation">) =>
  createOrderSchema(t).partial();

export const orderListParamsSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(PAGINATION.MAX_LIMIT).optional(),
  search: z.string().trim().optional(),
  status: orderStatusSchema.optional(),
});

export type OrderLineItemInput = z.infer<
  ReturnType<typeof orderLineItemInputSchema>
>;
export type CreateOrderInput = z.infer<ReturnType<typeof createOrderSchema>>;
export type UpdateOrderInput = z.infer<
  ReturnType<typeof createUpdateOrderSchema>
>;
export type OrderListParams = z.infer<typeof orderListParamsSchema>;
