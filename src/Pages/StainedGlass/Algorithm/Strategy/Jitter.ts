import { RNG } from "src/Libraries/Random";
import * as CN from "src/Libraries/ConstrainedNumber";
import * as UrlEncode from "src/Libraries/UrlEncode";

export type Tactic = (val: number) => number;
export const jitterConstraint: CN.Constraint<0.01, 0, 1> = {
  step: 0.01,
  min: 0,
  max: 1,
};
export type Jitter = CN.ConstrainedNumber<0.01, 0, 1>;
export const mkJitter = CN.fromNumber(jitterConstraint);
export const vSchema = UrlEncode.VConstrainedNumber(jitterConstraint);

/**
 *
 * By adding some randomness when assigning colors to the triangles some very
 * nice and pleasing effects can be achieved.
 *
 * @param {RNG} rng the random number generator to use
 * @param {number} magnitude number between 0-1
 * @returns a function that jitters its inputs
 */
export function factory(rng: RNG, magnitude: Jitter): Tactic {
  return function (val: number) {
    let lower = val - magnitude.value;
    if (lower < 0) {
      lower = 0;
    }
    let upper = val + magnitude.value;
    if (upper > 1) {
      upper = 1;
    }
    let out = rng.uniform(lower, upper);
    return out;
  };
}
