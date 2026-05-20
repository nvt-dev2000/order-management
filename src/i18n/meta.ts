import i18n from "@/i18n";

/** Document title for route meta — uses current i18n language */
export function pageTitle(key: string): string {
  return `${i18n.t(key as never)} | ${i18n.t("common:appName")}`;
}
