/**
 * Returns a nested property value from an object using a dot-separated path.
 *
 * Example:
 * ```ts
 * getObjectValueByPath(user, 'profile.address.city');
 * ```
 *
 * If any part of the path does not exist, `null` is returned.
 *
 * @param obj  The source object to read from
 * @param path Dot-separated path (e.g. "a.b.c")
 * @returns The value at the given path, or `null` if not found
 */
export function getObjectValueByPath(obj: any, path: string): any {
  return path.split('.').reduce((o, key) => (o ? o[key] : null), obj);
}
