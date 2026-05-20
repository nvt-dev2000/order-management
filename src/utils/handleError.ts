import { ERROR_CODE_KEYS } from "@/constants/errors";
import { t } from "@/utils/i18n";

/** Map API error codes to message list (citygas: ShowErrorMessage) */
export function getMessagesByErrorCodes(codes?: string[]): string[] {
  if (!codes?.length) return [];

  const messages = codes
    .map((code) => {
      if (!(ERROR_CODE_KEYS as readonly string[]).includes(code))
        return undefined;
      return t(`errors:${code}`);
    })
    .filter((msg): msg is string => Boolean(msg));

  return messages.length > 0 ? messages : [t("common:toast.defaultError")];
}

/** Return the first message for given codes, or fallback */
export function getFirstErrorMessage(
  codes?: string[],
  fallback: string = t("common:toast.defaultError"),
): string {
  const messages = getMessagesByErrorCodes(codes);
  return messages[0] ?? fallback;
}
