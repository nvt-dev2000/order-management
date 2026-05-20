/** Query param keys — keep in sync with useOrderListParams */
export const SEARCH_PARAMS = {
  PAGE: "page",
  LIMIT: "limit",
  SEARCH: "q",
  STATUS: "status",
} as const;

/** Keys excluded when counting active filters */
export const FILTER_EXCLUDE_KEYS = [
  SEARCH_PARAMS.PAGE,
  SEARCH_PARAMS.LIMIT,
] as const;
