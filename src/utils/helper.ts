/** True if the object has any non-empty filter values */
export function hasValues(values: object | null | undefined): boolean {
  if (!values) return false;

  return Object.values(values).some((value) => {
    if (value === null || value === undefined || value === "") return false;
    if (typeof value === "number" && value === 0) return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  });
}
