import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { DEFAULT_LOCALE } from "./config";
import { getInitialLocale } from "./routing";
import { resources } from "./resources";

void i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLocale(),
  fallbackLng: DEFAULT_LOCALE,
  defaultNS: "common",
  ns: [
    "common",
    "validation",
    "errors",
    "auth",
    "orders",
    "products",
    "returns",
    "dashboard",
  ],
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;
