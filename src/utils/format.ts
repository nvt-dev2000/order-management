export function formatCurrency(amount: number, currency = "VND") {
  const isVnd = currency === "VND";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
    maximumFractionDigits: isVnd ? 0 : 2,
    minimumFractionDigits: isVnd ? 0 : 2,
  }).format(amount);
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

/** Display value or em dash fallback */
export function displayValueOrDash(
  value: string | number | boolean | null | undefined,
  fallback = "—",
): string {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value);
}

export function formatPhoneNumber(phone: string | number): string {
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length === 10) {
    return digits.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
  }
  if (digits.length === 11) {
    return digits.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3");
  }
  return digits;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}
