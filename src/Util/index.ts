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

export function* intersperse<A, B>(
  a: A[],
  delim: B
): Generator<A | B, void, unknown> {
  let first = true;
  for (const x of a) {
    if (!first) yield delim;
    first = false;
    yield x;
  }
}

/**
 *
 * @param dimensionsW the max W value
 * @param dimensionsH the max H value
 * @param w width
 * @param h height
 * @returns constrained width and height
 */
export function fitToDimensions(
  dimensionsW: number,
  dimensionsH: number,
  w: number,
  h: number
): { width: number; height: number } {
  const toMul = Math.min(dimensionsW / w, dimensionsH / h);

  return {
    width: Math.floor(toMul < 1 ? w * toMul : w),
    height: Math.floor(toMul < 1 ? h * toMul : h),
  };
}

/**
 *
 * @param start number to start at (inclusive)
 * @param stop number to end at (inclusive)
 * @param step how many steps to take
 * @returns an array
 */
export function* range(
  start: number,
  stop?: number,
  step: number = 1
): Generator<number, void, unknown> {
  let i = start;
  while (stop === undefined || i < stop) {
    yield i;
    i += step;
  }
}
