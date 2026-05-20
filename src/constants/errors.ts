/** API error codes mapped to i18n keys in the `errors` namespace */
export const ERROR_CODE_KEYS = [
  "forbidden",
  "unauthorized",
  "token_invalid",
  "token_expired",
  "invalid_params",
  "record_not_found",
  "email_already_exists",
  "internal_server_error",
  "rate_limit",
] as const;

export type ApiErrorCode = (typeof ERROR_CODE_KEYS)[number];
