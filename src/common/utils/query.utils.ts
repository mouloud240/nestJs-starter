/**
 * Parse various formats of query parameters into a proper array of numbers
 * Handles array notation, comma-separated values, and single values
 * @param value The query parameter value to transform
 * @returns Array of numbers or undefined if empty
 */
export function parseIntArrayQueryParam(
  value: string | undefined,
): number[] | undefined {
  console.log('Query param transformer called with value:', value);
  // Handle empty values
  if (value === undefined || value === '') {
    return undefined;
  }

  // If query param is an array (e.g., ?labelIds=1&labelIds=2)
  if (Array.isArray(value)) {
    return value.map((v) => Number(v));
  }

  return value.split(',').map((v) => Number(v.trim()));
}
