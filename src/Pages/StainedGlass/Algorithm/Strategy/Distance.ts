import { RNG } from "src/Libraries/Random";
import Point2D from "../Point2D";
import Triangle from "../Triangle";
import * as P from "parsimmon";
import * as PExtra from "src/Libraries/ParsimmonExtra";

////////////////////////////////////////////////////////////////////////////////
// Types
////////////////////////////////////////////////////////////////////////////////

export type Tactic = (triangle: Triangle) => number;

export namespace Kind {
  // Types
  export type Type = XCentroid | YCentroid | DistanceToPoint;
  export type XCentroid = "X Centroid";
  export type YCentroid = "Y Centroid";
  export type DistanceToPoint = "Dist to Point";
  // Constructors
  export const XCentroid: XCentroid = "X Centroid";
  export const YCentroid: YCentroid = "Y Centroid";
  export const DistanceToPoint: DistanceToPoint = "Dist to Point";
  //
  export function toStrategy(
    kind: "X Centroid" | "Y Centroid" | "Dist to Point"
  ): Strategy.Type {
    switch (kind) {
      case "X Centroid":
        return Strategy.XCentroid;
      case "Y Centroid":
        return Strategy.YCentroid;
      case "Dist to Point":
        return Strategy.DistanceToPoint(0.5, 0.5);
    }
  }
}
export namespace Strategy {
  // Types
  export type Type = XCentroid | YCentroid | DistanceToPoint;
  export type XCentroid = { kind: Kind.XCentroid };
  export type YCentroid = { kind: Kind.YCentroid };
  export type DistanceToPoint = {
    kind: Kind.DistanceToPoint;
    x: number;
    y: number;
  };

  // Constructors
  export const XCentroid: XCentroid = { kind: Kind.XCentroid };
  export const YCentroid: YCentroid = { kind: Kind.YCentroid };
  export const DistanceToPoint: (x: number, y: number) => DistanceToPoint = (
    x,
    y
  ) => {
    return { kind: Kind.DistanceToPoint, x: x, y: y };
  };
}

////////////////////////////////////////////////////////////////////////////////
// Core
////////////////////////////////////////////////////////////////////////////////

export function factory(strat: Strategy.Type): Tactic {
  switch (strat.kind) {
    case "X Centroid":
      return x_centroid;
    case "Y Centroid":
      return y_centroid;
    case "Dist to Point":
      return dist_to_centroid(new Point2D(strat.x, strat.y));
  }
}

export function generate(prng: RNG): Strategy.Type {
  return prng.pickUniform([
    Strategy.XCentroid,
    Strategy.YCentroid,
    Strategy.DistanceToPoint(prng.random(), prng.random()),
    Strategy.DistanceToPoint(0.5, 0.5),
  ]);
}

////////////////////////////////////////////////////////////////////////////////
// encoding
////////////////////////////////////////////////////////////////////////////////

/**
 * This encoding must be as small as possible so we can store it in the URL
 *
 * Encode a Distance.Strategy value
 */
export const encode = (strat: Strategy.Type) => {
  if (strat.kind === Kind.XCentroid) {
    return "X";
  } else if (strat.kind === Kind.YCentroid) {
    return "Y";
  } else {
    return `D${strat.x}:${strat.y}`;
  }
};

const xDecoder: P.Parser<Strategy.XCentroid> = P.string("X").map(
  () => Strategy.XCentroid
);
const yDecoder: P.Parser<Strategy.YCentroid> = P.string("Y").map(
  () => Strategy.YCentroid
);

const dDecoder: P.Parser<Strategy.DistanceToPoint> = P.seqMap(
  P.string("D"),
  PExtra.floating,
  P.string(":"),
  PExtra.floating,
  (_d, x, _v, y) => Strategy.DistanceToPoint(x, y)
);

/**
 * This encoding must be as small as possible so we can store it in the URL
 *
 * Decode a Distance.Strategy value
 */
export const decode: P.Parser<Strategy.Type> = P.alt(
  xDecoder,
  yDecoder,
  dDecoder
);

////////////////////////////////////////////////////////////////////////////////
// Impl
////////////////////////////////////////////////////////////////////////////////

/**
 *
 * @param {triangle} triangle
 * @returns returns the x coordinate of the triangle's centroid
 */
const x_centroid: Tactic = (triangle) => {
  return triangle.center().x;
};

/**
 *
 * @param {triangle} triangle
 * @returns returns the y coordinate of the triangle's centroid
 */
const y_centroid: Tactic = (triangle) => {
  return triangle.center().y;
};

/**
 *
 * @param {Point} other
 * @returns a function that calculates the euclidean distance between a triangle
 * and the given Point.
 */
const dist_to_centroid: (other: Point2D) => Tactic = (other) => (triangle) => {
  return triangle.center().distance_to(other);
};
