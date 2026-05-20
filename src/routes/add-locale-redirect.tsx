import { redirect } from "react-router";

import { localizePathname } from "@/i18n/routing";
import { readPersistedLocale } from "@/i18n/persisted-locale";

export function clientLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const locale = readPersistedLocale();
  throw redirect(
    localizePathname(locale, url.pathname) + url.search + url.hash,
  );
}

export default function AddLocaleRedirect() {
  return null;
}
