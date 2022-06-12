import { RNG } from "src/Libraries/Random";
import * as Palette from "src/Libraries/P5Extra/Palette";

/**
 *
 * @param {RNG} rng a random number generator
 * @returns a cosine palette taking in a number and spitting out a color
 */
export function generatePalette(rng: RNG): Palette.Cosine.Palette {
  let levels = [0, 1 / 5, 2 / 5, 3 / 5, 4 / 5, 1];
  let b_picks = [1 / 4, 1 / 2, 3 / 4];
  let c_picks = [2 / 5, 3 / 5, 4 / 5, 1];
  return {
    red: {
      a: rng.pickUniform(levels),
      b:
        rng.pickUniform(b_picks) +
        rng.truncated_gaussian(0.125, 0.5, 0.05, 0.2),
      c: rng.pickUniform(c_picks),
      d: rng.pickUniform(levels),
    },
    green: {
      a: rng.pickUniform(levels),
      b:
        rng.pickUniform(b_picks) +
        rng.truncated_gaussian(0.125, 0.5, 0.05, 0.2),
      c: rng.pickUniform(c_picks),
      d: rng.pickUniform(levels),
    },
    blue: {
      a: rng.pickUniform(levels),
      b:
        rng.pickUniform(b_picks) +
        rng.truncated_gaussian(0.125, 0.5, 0.05, 0.2),
      c: rng.pickUniform(c_picks),
      d: rng.pickUniform(levels),
    },
    mode: rng.pickFromWeightedList<Palette.Cosine.Mode>([
      { weight: 9, value: "SMOOTH" },
      { weight: 1, value: "MOD" },
    ]),
  };
}
