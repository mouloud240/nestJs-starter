import { isNil, omitBy, isObject } from 'lodash';
/**
 * Recursively omits properties from an object based on a predicate function.
 *
 * @param obj - The object to process. Must be a plain object or array.
 * @param predicate - A function that determines whether a property should be omitted.
 * @returns A new object with properties omitted based on the predicate.
 */
export function deepOmitBy<T extends Record<string, any> | any[]>(
  obj: T,
  predicate: (value: any, key: string | number) => boolean,
): T {
  if (!isObject(obj)) {
    return obj;
  }

  const result = omitBy(obj, predicate) as T;

  // Process nested objects recursively
  for (const key in result) {
    if (isObject(result[key])) {
      result[key] = deepOmitBy(result[key], predicate);
    }
  }

  return result;
}

/**
 * Recursively removes null and undefined values from an object.
 *
 * @param obj - The object to process. Must be a plain object or array.
 * @returns A new object with null and undefined values removed.
 */
export function deepOmitByNil<T extends Record<string, any> | any[]>(
  obj: T,
): T {
  return deepOmitBy(obj, isNil);
}
