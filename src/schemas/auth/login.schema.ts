import type { TFunction } from "i18next";
import { z } from "zod";

export const createLoginSchema = (t: TFunction<"validation">) =>
  z.object({
    email: z.string().email(t("emailInvalid")),
    password: z.string().min(6, t("passwordMin")),
  });

export type LoginInput = z.infer<ReturnType<typeof createLoginSchema>>;
