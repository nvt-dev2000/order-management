import { redirect } from "react-router";

import { getInitialLocale } from "@/i18n/routing";

export function clientLoader() {
  throw redirect(`/${getInitialLocale()}`);
}

export default function RootRedirect() {
  return null;
}
