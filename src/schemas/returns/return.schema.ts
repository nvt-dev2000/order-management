import type { TFunction } from "i18next";
import { z } from "zod";

import { PAGINATION } from "@/constants";
import { RETURN_STATUS } from "@/constants/return-status";

const returnStatusSchema = z.enum([
  RETURN_STATUS.PENDING,
  RETURN_STATUS.APPROVED,
  RETURN_STATUS.REJECTED,
  RETURN_STATUS.REFUNDED,
]);

const returnLineItemInputSchema = (t: TFunction<"validation">) =>
  z.object({
    productId: z.string().min(1, t("productRequired")),
    quantity: z.coerce.number().int(t("quantityInt")).min(1, t("quantityMin")),
  });

export const createReturnSchema = (t: TFunction<"validation">) =>
  z.object({
    orderId: z.string().min(1, t("orderRequired")),
    reason: z.string().trim().min(1, t("returnReasonRequired")),
    items: z.array(returnLineItemInputSchema(t)).min(1, t("returnItemsMin")),
  });

export const updateReturnStatusSchema = (_t: TFunction<"validation">) =>
  z.object({
    status: returnStatusSchema,
  });

export const returnListParamsSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(PAGINATION.MAX_LIMIT).optional(),
  search: z.string().trim().optional(),
  status: returnStatusSchema.optional(),
});

export type ReturnLineItemInput = z.infer<
  ReturnType<typeof returnLineItemInputSchema>
>;
export type CreateReturnInput = z.infer<ReturnType<typeof createReturnSchema>>;
export type UpdateReturnStatusInput = z.infer<
  ReturnType<typeof updateReturnStatusSchema>
>;
export type ReturnListParams = z.infer<typeof returnListParamsSchema>;
