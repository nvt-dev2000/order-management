import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";
import { readPersistedLocale } from "./persisted-locale";

/** Drops the first path segment (used under `:locale` layout). */
export function stripFirstSegment(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return "/";
  const rest = segments.slice(1).join("/");
  return rest ? `/${rest}` : "/";
}

/** Path without a supported locale prefix, e.g. `/orders` or `/login` */
export function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return "/";
  if (isLocale(segments[0])) {
    const rest = segments.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const first = pathname.split("/").filter(Boolean)[0];
  return isLocale(first) ? first : null;
}

export function localizePathname(locale: Locale, pathname: string): string {
  const bare = stripLocalePrefix(pathname);
  if (bare === "/") return `/${locale}`;
  return `/${locale}${bare}`;
}

export function swapLocaleInPathname(
  pathname: string,
  newLocale: Locale,
): string {
  return localizePathname(newLocale, pathname);
}

export function getInitialLocale(): Locale {
  if (typeof window !== "undefined") {
    const fromPath = getLocaleFromPathname(window.location.pathname);
    if (fromPath) return fromPath;
  }
  return readPersistedLocale();
}

export function resolveLocaleParam(param: string | undefined): Locale {
  return isLocale(param) ? param : DEFAULT_LOCALE;
}
