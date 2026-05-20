import type { TFunction } from "i18next";
import { z } from "zod";

import { PAGINATION } from "@/constants";
import { PRODUCT_CATEGORIES, PRODUCT_STATUS } from "@/constants/product-status";

const productStatusSchema = z.enum([
  PRODUCT_STATUS.ACTIVE,
  PRODUCT_STATUS.INACTIVE,
]);

const productCategorySchema = z.enum(PRODUCT_CATEGORIES);

export const createProductSchema = (t: TFunction<"validation">) =>
  z.object({
    sku: z.string().trim().min(1, t("skuRequired")),
    name: z.string().trim().min(1, t("productNameRequired")),
    category: productCategorySchema,
    price: z.coerce.number().min(0, t("priceMin")),
    stock: z.coerce.number().int(t("stockInt")).min(0, t("stockMin")),
    status: productStatusSchema,
    description: z.string().trim().optional(),
  });

export const createUpdateProductSchema = (t: TFunction<"validation">) =>
  createProductSchema(t).partial();

export const productListParamsSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(PAGINATION.MAX_LIMIT).optional(),
  search: z.string().trim().optional(),
  category: productCategorySchema.optional(),
  status: productStatusSchema.optional(),
});

export type CreateProductInput = z.infer<
  ReturnType<typeof createProductSchema>
>;
export type UpdateProductInput = z.infer<
  ReturnType<typeof createUpdateProductSchema>
>;
export type ProductListParams = z.infer<typeof productListParamsSchema>;
