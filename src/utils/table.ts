import { FILTER_EXCLUDE_KEYS, PAGINATION } from "@/constants";

/** Row index in a paginated table */
export function getRowNumber(
  rowIndex: number,
  currentPage = PAGINATION.DEFAULT_PAGE,
  pageSize = PAGINATION.DEFAULT_LIMIT,
): number {
  return pageSize * (currentPage - 1) + rowIndex + 1;
}

/** Count active filters from URLSearchParams */
export function getActiveFilterCount(
  searchParams: URLSearchParams,
  excludeKeys: readonly string[] = FILTER_EXCLUDE_KEYS,
): number {
  let count = 0;
  searchParams.forEach((value, key) => {
    if ((excludeKeys as readonly string[]).includes(key)) return;
    if (value.trim() !== "") count += 1;
  });
  return count;
}

/** Count active filters from a params object */
export function getFilterCountFromObject(
  params: Record<string, unknown>,
  excludeKeys: readonly string[] = FILTER_EXCLUDE_KEYS,
): number {
  return Object.entries(params).filter(([key, value]) => {
    if ((excludeKeys as readonly string[]).includes(key)) return false;
    if (value === "" || value === undefined || value === null) return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  }).length;
}
