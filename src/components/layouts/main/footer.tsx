import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation("common");
  const year = new Date().getFullYear();

  return (
    <footer className="text-muted-foreground shrink-0 border-t px-6 py-3 text-center text-xs">
      {t("footerCopyright", { year, appName: t("appName") })}
    </footer>
  );
}
