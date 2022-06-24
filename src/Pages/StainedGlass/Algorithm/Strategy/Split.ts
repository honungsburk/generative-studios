import { RNG } from "src/Libraries/Random";
import Point2D from "../Point2D";
import Triangle from "../Triangle";
import * as P from "parsimmon";
import * as UrlEncode from "src/Libraries/UrlEncode";

////////////////////////////////////////////////////////////////////////////////
// Types
////////////////////////////////////////////////////////////////////////////////

export type Tactic = (triangle: Triangle) => [Triangle, Triangle];

export const RANDOM: Strategy = "Split Random";
export const RANDOM_BALANCED: Strategy = "Split Random Balanced";
export const MIDDLE: Strategy = "Split Middle";

export type Strategy =
  | "Split Random"
  | "Split Random Balanced"
  | "Split Middle";

export const vSchema = UrlEncode.VEnumString([RANDOM, RANDOM_BALANCED, MIDDLE]);

////////////////////////////////////////////////////////////////////////////////
// Core
////////////////////////////////////////////////////////////////////////////////

/**
 *
 * @param prng the psuedo random number generator
 * @param strategy the strategy to create the tactic from
 * @returns a specific Split.Tactic
 */
export function factory(prng: RNG, strategy: Strategy): Tactic {
  switch (strategy) {
    case "Split Random":
      return split_random(prng);
    case "Split Random Balanced":
      return split_random_balanced(prng);
    case "Split Middle":
      return split_middle;
  }
}

/**
 *
 * @param prng the psuedo random number generator
 * @returns a random strategy
 */
export function generate(prng: RNG): Strategy {
  return prng.pickFromWeightedList([
    { weight: 1, value: "Split Random" },
    { weight: 2, value: "Split Random Balanced" },
    { weight: 1, value: "Split Random Balanced" },
  ]);
}

////////////////////////////////////////////////////////////////////////////////
// encoding
////////////////////////////////////////////////////////////////////////////////

/**
 * This encoding must be as small as possible so we can store it in the URL
 *
 * Encode a Split.Strategy value
 */
export const encode = (strat: Strategy) => {
  if (strat === RANDOM) {
    return "1";
  } else if (strat === RANDOM_BALANCED) {
    return "2";
  } else {
    return "3";
  }
};

/**
 * This encoding must be as small as possible so we can store it in the URL
 *
 * Decode a Split.Strategy value
 */
export const decode: P.Parser<Strategy> = P.digit.chain((d) => {
  if (d === "1") {
    return P.succeed(RANDOM);
  } else if (d === "2") {
    return P.succeed(RANDOM_BALANCED);
  } else if (d === "3") {
    return P.succeed(MIDDLE);
  } else {
    return P.fail(`${d} is not a valid Split.Strategy`);
  }
});

////////////////////////////////////////////////////////////////////////////////
// Execution
////////////////////////////////////////////////////////////////////////////////

/**
 *
 * This splitting strategy is responsible for making the symmetric splitting.
 *
 * @param {json} triangle
 */
const split_middle: Tactic = (triangle) => {
  //find the longest side
  let origin = new Point2D(0, 0);
  let lab = triangle.a.minus(triangle.b).distance_to(origin);
  let lac = triangle.a.minus(triangle.c).distance_to(origin);
  let lbc = triangle.b.minus(triangle.c).distance_to(origin);

  if (lab > lac && lab > lbc) {
    let d = triangle.a.add(triangle.b).scale(0.5);
    return [
      new Triangle(triangle.c, triangle.a, d),
      new Triangle(triangle.c, triangle.b, d),
    ];
  }

  if (lac > lab && lac > lbc) {
    let d = triangle.a.add(triangle.c).scale(0.5);
    return [
      new Triangle(triangle.b, triangle.a, d),
      new Triangle(triangle.b, triangle.c, d),
    ];
  }

  let d = triangle.b.add(triangle.c).scale(0.5);
  //find the middle point on the other side
  return [
    new Triangle(triangle.a, triangle.b, d),
    new Triangle(triangle.a, triangle.c, d),
  ];
};

/**
 * This splitting strategy created the more 'spiky' images.
 *
 * @param {RNG} rng
 * @returns
 */
const split_random: (rng: RNG) => Tactic = (rng) => (triangle) => {
  let cut = rng.truncated_gaussian(0.5, 1, 0.1, 0.9);
  let choice = rng.random();
  if (choice < 1 / 3) {
    let d = triangle.a.minus(triangle.b).scale(cut).add(triangle.b);
    return [
      new Triangle(triangle.c, triangle.a, d),
      new Triangle(triangle.c, triangle.b, d),
    ];
  }

  if (choice < 2 / 3) {
    let d = triangle.a.minus(triangle.c).scale(cut).add(triangle.c);
    return [
      new Triangle(triangle.b, triangle.a, d),
      new Triangle(triangle.b, triangle.c, d),
    ];
  }

  let d = triangle.b.minus(triangle.c).scale(cut).add(triangle.c);
  //find the middle point on the other side
  return [
    new Triangle(triangle.a, triangle.b, d),
    new Triangle(triangle.a, triangle.c, d),
  ];
};

/**
 * This splitting strategy creates the randomly split triangles, but not
 * the spiky ones.
 *
 * @param {RNG} rng
 * @returns
 */
const split_random_balanced: (rng: RNG) => Tactic = (rng) => (triangle) => {
  let cut = rng.truncated_gaussian(0.5, 1, 0.1, 0.9);
  //find the longest side
  let origin = new Point2D(0, 0);
  let lab = triangle.a.minus(triangle.b).distance_to(origin);
  let lac = triangle.a.minus(triangle.c).distance_to(origin);
  let lbc = triangle.b.minus(triangle.c).distance_to(origin);

  if (lab > lac && lab > lbc) {
    let d = triangle.a.minus(triangle.b).scale(cut).add(triangle.b);
    return [
      new Triangle(triangle.c, triangle.a, d),
      new Triangle(triangle.c, triangle.b, d),
    ];
  }

  if (lac > lab && lac > lbc) {
    let d = triangle.a.minus(triangle.c).scale(cut).add(triangle.c);
    return [
      new Triangle(triangle.b, triangle.a, d),
      new Triangle(triangle.b, triangle.c, d),
    ];
  }
  let d = triangle.b.minus(triangle.c).scale(cut).add(triangle.c);
  //find the middle point on the other side
  return [
    new Triangle(triangle.a, triangle.b, d),
    new Triangle(triangle.a, triangle.c, d),
  ];
};
