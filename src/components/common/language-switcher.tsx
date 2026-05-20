import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { LOCALE_LABELS, SUPPORTED_LOCALES } from "@/i18n/config";
import { swapLocaleInPathname } from "@/i18n/routing";
import { useUiStore } from "@/stores/ui.store";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const locale = useUiStore((s) => s.locale);
  const setLocale = useUiStore((s) => s.setLocale);

  const cycleLocale = () => {
    const index = SUPPORTED_LOCALES.indexOf(locale);
    const next = SUPPORTED_LOCALES[(index + 1) % SUPPORTED_LOCALES.length];
    setLocale(next);
    const pathname = swapLocaleInPathname(location.pathname, next);
    navigate(`${pathname}${location.search}${location.hash}`, {
      replace: true,
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={cycleLocale}
      aria-label={`${i18n.t("common:language")}: ${LOCALE_LABELS[locale]}`}
    >
      {LOCALE_LABELS[locale]}
    </Button>
  );
}
