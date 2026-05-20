import type { ReactNode } from "react";
import type {
  Control,
  FieldPath,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import type { ZodSchema } from "zod";

export type DynamicFieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "select";

export interface DynamicSelectOption {
  value: string;
  label: string;
}

export interface DynamicFormFieldConfig<
  TFieldValues extends FieldValues = FieldValues,
> {
  name: FieldPath<TFieldValues>;
  type: DynamicFieldType;
  label: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  /** Wrapper FormItem */
  className?: string;
  colSpan?: 1 | 2;
  options?: DynamicSelectOption[];
  hidden?: boolean | ((values: TFieldValues) => boolean);
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> &
    React.TextareaHTMLAttributes<HTMLTextAreaElement>;
}

export interface DynamicFormProps<TFieldValues extends FieldValues> {
  schema: ZodSchema<TFieldValues>;
  fields: DynamicFormFieldConfig<TFieldValues>[];
  defaultValues?: TFieldValues;
  onSubmit: (values: TFieldValues) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  className?: string;
  formClassName?: string;
  columns?: 1 | 2;
  hideSubmit?: boolean;
  submitButtonClassName?: string;
  footer?: ReactNode | ((form: UseFormReturn<TFieldValues>) => ReactNode);
}

export function defineFormFields<TFieldValues extends FieldValues>(
  fields: DynamicFormFieldConfig<TFieldValues>[],
): DynamicFormFieldConfig<TFieldValues>[] {
  return fields;
}

export type DynamicFormFieldRendererProps<TFieldValues extends FieldValues> = {
  config: DynamicFormFieldConfig<TFieldValues>;
  control: Control<TFieldValues>;
};
