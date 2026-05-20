import { Navigate, Outlet, useLocation, useParams } from "react-router";

import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";
import { localizePathname, stripFirstSegment } from "@/i18n/routing";

import { useLocale } from "@/hooks/use-locale";

export default function LocaleLayout() {
  const { locale: localeParam } = useParams();
  const location = useLocation();

  if (!isLocale(localeParam)) {
    const target =
      localizePathname(DEFAULT_LOCALE, stripFirstSegment(location.pathname)) +
      location.search +
      location.hash;
    return <Navigate to={target} replace />;
  }

  return <LocaleOutlet />;
}

function LocaleOutlet() {
  useLocale();
  return <Outlet />;
}
