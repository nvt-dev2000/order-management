import i18n from "@/i18n";

/** Translate outside React (axios interceptors, query client, zod defaults). */
export function t(
  key: string,
  options?: Record<string, string | number>,
): string {
  return String(i18n.t(key, options as never));
}
