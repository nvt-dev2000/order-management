export const DATE_FORMAT = {
  VI_DATE: "vi-VN-date",
  VI_DATETIME: "vi-VN-datetime",
  ISO_DATE: "YYYY-MM-DD",
} as const;

export function formatDateVi(
  date: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    dateStyle: "medium",
    timeStyle: "short",
  },
): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("vi-VN", options).format(d);
}

export function formatDateOnly(date: string | Date | null | undefined): string {
  return formatDateVi(date, { dateStyle: "medium" });
}

export function toISODateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}
