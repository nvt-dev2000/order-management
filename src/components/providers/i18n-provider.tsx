import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";

import i18n from "@/i18n";
import { useUiStore } from "@/stores/ui.store";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = useUiStore((s) => s.locale);

  useEffect(() => {
    void i18n.changeLanguage(locale);
    document.documentElement.lang = locale;
  }, [locale]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
