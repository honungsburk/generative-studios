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
export function round(step: number): (n: number) => number {
  return (n) => Math.round(n / step) * step;
}

/**
 *
 * @param n a number between [0, 1]
 * @param start start value
 * @param start end value
 * @returns a value between start and end
 */
export function map(start: number, end: number): (n: number) => number {
  return (n) => {
    if (n < 0) {
      return start;
    }

    if (n > end) {
      return end;
    }

    return start + (end - start) * n;
  };
}

/**
 *
 * @param min the minimum value the number can have
 * @param max the maximum value the number can have
 * @returns a function that bounds a number between min and max
 */
export function bound(min: number, max: number): (n: number) => number {
  return (n) => {
    if (n < min) {
      return min;
    } else if (n > max) {
      return max;
    } else {
      return n;
    }
  };
}
