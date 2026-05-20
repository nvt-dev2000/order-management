import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { DynamicForm, defineFormFields } from "@/components/common";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLogin } from "@/hooks/auth/use-login";
import {
  createLoginSchema,
  type LoginInput,
} from "@/schemas/auth/login.schema";

export function LoginForm() {
  const { t, i18n } = useTranslation(["auth", "common"]);
  const { mutate, isPending } = useLogin();

  const schema = useMemo(
    () => createLoginSchema(i18n.getFixedT(null, "validation")),
    [i18n],
  );

  const fields = useMemo(
    () =>
      defineFormFields<LoginInput>([
        {
          name: "email",
          type: "email",
          label: t("common:email"),
          placeholder: "admin@example.com",
        },
        {
          name: "password",
          type: "password",
          label: t("common:password"),
          placeholder: "••••••",
        },
      ]),
    [t],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("auth:loginTitle")}</CardTitle>
        <CardDescription>{t("auth:loginDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <DynamicForm
          schema={schema}
          fields={fields}
          defaultValues={{ email: "test@example.com", password: "123456" }}
          onSubmit={(data) => mutate(data)}
          isSubmitting={isPending}
          submitLabel={isPending ? t("auth:loggingIn") : t("auth:loginSubmit")}
          submitButtonClassName="w-full"
          className="space-y-4"
          formClassName="space-y-4"
        />
      </CardContent>
    </Card>
  );
}
