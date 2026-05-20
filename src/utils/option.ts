/** Resolve label from { id, label } options  */
export function getDisplayValue<
  T extends { id: string | number; label: string },
>(options: readonly T[], value?: string | number | null): string {
  if (value === undefined || value === null || value === "") return "";
  const found = options.find((opt) => String(opt.id) === String(value));
  return found?.label ?? "";
}

/** Lookup label from a Record (e.g. status label maps) */
export function getLabelFromRecord<T extends string>(
  labels: Record<T, string>,
  value?: T | string | null,
): string {
  if (!value) return "";
  return labels[value as T] ?? String(value);
}
