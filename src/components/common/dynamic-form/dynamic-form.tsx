import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Resolver,
} from "react-hook-form";

import { DynamicFormField } from "@/components/common/dynamic-form/dynamic-form-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import type { DynamicFormProps } from "@/types/forms/dynamic-form.types";

export function DynamicForm<TFieldValues extends FieldValues>({
  schema,
  fields,
  defaultValues,
  onSubmit,
  submitLabel = "Submit",
  isSubmitting = false,
  className,
  formClassName,
  columns = 1,
  hideSubmit = false,
  submitButtonClassName,
  footer,
}: DynamicFormProps<TFieldValues>) {
  const form = useForm<TFieldValues>({
    resolver: zodResolver(schema as never) as Resolver<TFieldValues>,
    defaultValues: defaultValues as DefaultValues<TFieldValues>,
  });

  const layoutClassName =
    columns === 2 ? "grid grid-cols-2 gap-4" : "space-y-4";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(className)}
        noValidate
      >
        <div className={cn(layoutClassName, formClassName)}>
          {fields.map((fieldConfig) => (
            <div
              key={fieldConfig.name}
              className={cn(
                columns === 2 && fieldConfig.colSpan === 2 && "col-span-2",
              )}
            >
              <DynamicFormField config={fieldConfig} control={form.control} />
            </div>
          ))}
        </div>

        {!hideSubmit && (
          <Button
            type="submit"
            className={cn("mt-4", submitButtonClassName)}
            disabled={isSubmitting}
          >
            {submitLabel}
          </Button>
        )}

        {typeof footer === "function" ? footer(form) : footer}
      </form>
    </Form>
  );
}
