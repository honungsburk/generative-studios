/**
 *
 * @param objects objects to check that they have the same keys
 * @returns
 */
export function objectsHaveSameKeys(...objects: object[]) {
  const allKeys = objects.reduce<string[]>(
    (keys, object) => keys.concat(Object.keys(object)),
    []
  );
  const union = new Set(allKeys);
  return objects.every((object) => union.size === Object.keys(object).length);
}
