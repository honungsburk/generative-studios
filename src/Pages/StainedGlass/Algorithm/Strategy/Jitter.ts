import { RNG } from "src/Libraries/Random";

export type Tactic = (val: number) => number;

/**
 *
 * By adding some randomness when assigning colors to the triangles some very
 * nice and pleasing effects can be achieved.
 *
 * @param {RNG} rng the random number generator to use
 * @param {number} magnitude number between 0-1
 * @returns a function that jitters its inputs
 */
export function factory(rng: RNG, magnitude: number): Tactic {
  return function (val: number) {
    let lower = val - magnitude;
    if (lower < 0) {
      lower = 0;
    }
    let upper = val + magnitude;
    if (upper > 1) {
      upper = 1;
    }
    let out = rng.uniform(lower, upper);
    return out;
  };
}
