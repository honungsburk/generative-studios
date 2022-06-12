import { RNG } from "src/Libraries/Random";
import Point2D from "../Point2D";
import Triangle from "../Triangle";

export type DistanceStrategyFn = (triangle: Triangle) => number;

export const XCentroid: DistanceStrategy = { kind: "X Centroid" };
export const YCentroid: DistanceStrategy = { kind: "Y Centroid" };
export const DistToPoint: (x: number, y: number) => DistanceStrategy = (
  x,
  y
) => {
  return { kind: "Dist to Point", x: x, y: y };
};

export function getDistanceStrategy(
  kind: "X Centroid" | "Y Centroid" | "Dist to Point"
): DistanceStrategy {
  switch (kind) {
    case "X Centroid":
      return XCentroid;
    case "Y Centroid":
      return YCentroid;
    case "Dist to Point":
      return DistToPoint(Math.random(), Math.random());
  }
}

export type DistanceStrategy =
  | XCentroidStrategy
  | YCentroidStrategy
  | DistanceToPointStrategy;
export type XCentroidStrategy = { kind: "X Centroid" };
export type YCentroidStrategy = { kind: "Y Centroid" };
export type DistanceToPointStrategy = {
  kind: "Dist to Point";
  x: number;
  y: number;
};

export function getDistStrategyFn(strat: DistanceStrategy): DistanceStrategyFn {
  switch (strat.kind) {
    case "X Centroid":
      return x_centroid;
    case "Y Centroid":
      return y_centroid;
    case "Dist to Point":
      return dist_to_centroid(new Point2D(strat.x, strat.y));
  }
}

export function generateDistStrategy(rng: RNG): DistanceStrategy {
  return rng.pickUniform([
    XCentroid,
    YCentroid,
    DistToPoint(rng.random(), rng.random()),
    DistToPoint(0.5, 0.5),
  ]);
}

/**
 *
 * @param {triangle} triangle
 * @returns returns the x coordinate of the triangle's centroid
 */
const x_centroid: DistanceStrategyFn = (triangle) => {
  return triangle.center().x;
};

/**
 *
 * @param {triangle} triangle
 * @returns returns the y coordinate of the triangle's centroid
 */
const y_centroid: DistanceStrategyFn = (triangle) => {
  return triangle.center().y;
};

/**
 *
 * @param {Point} other
 * @returns a function that calculates the euclidean distance between a triangle
 * and the given Point.
 */
const dist_to_centroid: (other: Point2D) => DistanceStrategyFn =
  (other) => (triangle) => {
    return triangle.center().distance_to(other);
  };
