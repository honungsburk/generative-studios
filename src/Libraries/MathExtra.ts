/**
 *
 * @param {number} a number to be taken mod
 * @param {number} m the number to be modding
 * @returns a number between [0 m)
 */
export function mod(a: number, m: number): number {
  let result = a;
  while (result >= m) {
    result -= m;
  }

  while (result < 0) {
    result += m;
  }

  return result;
}

/**
 *
 * @param {number} a the base
 * @param {number} b the hight
 * @param {number} c the speed
 * @param {number} d the offset
 * @returns a cosine function
 */
export function cosine(
  a: number,
  b: number,
  c: number,
  d: number
): (t: number) => number {
  return function (t) {
    return a + b * Math.cos(c * t + d);
  };
}

/**
 *
 * @param n the number to round
 * @param step the step to round
 * @returns a number that has been rounded off
 */
export function round(n: number, step: number) {
  return Math.round(n / step) * step;
}
