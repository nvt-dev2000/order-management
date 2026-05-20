import { useEffect } from "react";
import { useParams } from "react-router";

import { type Locale } from "@/i18n/config";
import { resolveLocaleParam } from "@/i18n/routing";
import { useUiStore } from "@/stores/ui.store";

export function useLocale(): Locale {
  const { locale: localeParam } = useParams();
  const locale = resolveLocaleParam(localeParam);
  const setLocale = useUiStore((s) => s.setLocale);

  useEffect(() => {
    setLocale(locale);
  }, [locale, setLocale]);

  return locale;
}
