import { STORAGE_KEYS } from "@/constants/storage";

import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";

export function readPersistedLocale(): Locale {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.UI);
    if (!raw) return DEFAULT_LOCALE;
    const parsed = JSON.parse(raw) as { state?: { locale?: unknown } };
    const locale = parsed.state?.locale;
    return isLocale(locale) ? locale : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}
