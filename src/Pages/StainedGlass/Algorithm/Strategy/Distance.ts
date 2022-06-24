import { RNG } from "src/Libraries/Random";
import Point2D from "../Point2D";
import Triangle from "../Triangle";
import * as CN from "src/Libraries/ConstrainedNumber";
import * as UrlEncode from "src/Libraries/UrlEncode";

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
        return Strategy.DistanceToPoint(
          Constraints.DistanceToPoint.mkNumber(0.5),
          Constraints.DistanceToPoint.mkNumber(0.5)
        );
    }
  }
}

export namespace Constraints {
  export namespace DistanceToPoint {
    export const numberConstraint: CN.Constraint<0.01, 0, 1> = {
      step: 0.01,
      min: 0,
      max: 1,
    };
    export type Number = CN.ConstrainedNumber<0.01, 0, 1>;
    export const mkNumber = CN.fromNumber(numberConstraint);
  }
}

export namespace Strategy {
  // Types
  export type Type = XCentroid | YCentroid | DistanceToPoint;
  export type XCentroid = { kind: Kind.XCentroid };
  export type YCentroid = { kind: Kind.YCentroid };
  export type DistanceToPoint = {
    kind: Kind.DistanceToPoint;
    x: Constraints.DistanceToPoint.Number;
    y: Constraints.DistanceToPoint.Number;
  };

  export const vSchema = UrlEncode.VOr([
    UrlEncode.VObject({ kind: UrlEncode.VEnumString([Kind.XCentroid]) }),
    UrlEncode.VObject({ kind: UrlEncode.VEnumString([Kind.YCentroid]) }),
    UrlEncode.VObject({
      kind: UrlEncode.VEnumString([Kind.DistanceToPoint]),
      x: UrlEncode.VConstrainedNumber(
        Constraints.DistanceToPoint.numberConstraint
      ),
      y: UrlEncode.VConstrainedNumber(
        Constraints.DistanceToPoint.numberConstraint
      ),
    }),
  ]);

  // Constructors
  export const XCentroid: XCentroid = { kind: Kind.XCentroid };
  export const YCentroid: YCentroid = { kind: Kind.YCentroid };
  export const DistanceToPoint: (
    x: Constraints.DistanceToPoint.Number,
    y: Constraints.DistanceToPoint.Number
  ) => DistanceToPoint = (x, y) => {
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
      return dist_to_centroid(new Point2D(strat.x.value, strat.y.value));
  }
}

export function generate(prng: RNG): Strategy.Type {
  return prng.pickUniform([
    Strategy.XCentroid,
    Strategy.YCentroid,
    Strategy.DistanceToPoint(
      Constraints.DistanceToPoint.mkNumber(prng.random()),
      Constraints.DistanceToPoint.mkNumber(prng.random())
    ),
    Strategy.DistanceToPoint(
      Constraints.DistanceToPoint.mkNumber(0.5),
      Constraints.DistanceToPoint.mkNumber(0.5)
    ),
  ]);
}

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
