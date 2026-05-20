import {
  useWatch,
  type ControllerRenderProps,
  type FieldValues,
} from "react-hook-form";

import {
  FormControl,
  FormDescription,
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
import { cn } from "@/lib/utils";
import type { DynamicFormFieldRendererProps } from "@/types/forms/dynamic-form.types";

function renderControl<TFieldValues extends FieldValues>(
  config: DynamicFormFieldRendererProps<TFieldValues>["config"],
  field: ControllerRenderProps<TFieldValues>,
) {
  const { type, placeholder, disabled, options, inputProps } = config;

  switch (type) {
    case "select":
      return (
        <Select
          value={String(field.value ?? "")}
          onValueChange={field.onChange}
          disabled={disabled}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "textarea":
      return (
        <FormControl>
          <textarea
            className={cn(
              "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-20 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            )}
            placeholder={placeholder}
            disabled={disabled}
            {...field}
            value={field.value ?? ""}
            {...inputProps}
          />
        </FormControl>
      );

    case "number":
      return (
        <FormControl>
          <Input
            type="number"
            placeholder={placeholder}
            disabled={disabled}
            {...field}
            {...inputProps}
          />
        </FormControl>
      );

    case "email":
      return (
        <FormControl>
          <Input
            type="email"
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="email"
            {...field}
            {...inputProps}
          />
        </FormControl>
      );

    case "password":
      return (
        <FormControl>
          <Input
            type="password"
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="current-password"
            {...field}
            {...inputProps}
          />
        </FormControl>
      );

    default:
      return (
        <FormControl>
          <Input
            type="text"
            placeholder={placeholder}
            disabled={disabled}
            {...field}
            {...inputProps}
          />
        </FormControl>
      );
  }
}

export function DynamicFormField<TFieldValues extends FieldValues>({
  config,
  control,
}: DynamicFormFieldRendererProps<TFieldValues>) {
  const values = useWatch({ control }) as TFieldValues;

  const isHidden =
    config.hidden === true ||
    (typeof config.hidden === "function" && config.hidden(values));

  if (isHidden) return null;

  return (
    <FormField
      control={control}
      name={config.name}
      render={({ field }) => (
        <FormItem className={config.className}>
          <FormLabel>{config.label}</FormLabel>
          {renderControl(config, field)}
          {config.description ? (
            <FormDescription>{config.description}</FormDescription>
          ) : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
