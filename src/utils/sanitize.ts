/** Sanitize URL / form params  */

export function sanitizeString(
  value: string | null | undefined,
): string | undefined {
  if (!value?.trim()) return undefined;
  return value.trim();
}

export function sanitizeInt(
  value: string | null | undefined,
  defaultValue?: number,
): number | undefined {
  if (!value) return defaultValue;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
}

export function sanitizeIntInRange(
  value: string | null | undefined,
  min: number,
  max: number,
  defaultValue: number,
): number {
  const parsed = sanitizeInt(value, defaultValue) ?? defaultValue;
  return Math.max(min, Math.min(max, parsed));
}
