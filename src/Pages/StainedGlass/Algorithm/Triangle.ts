import Point2D from "./Point2D";

/**
 * A triangle on a plane
 */
export default class Triangle {
  a: Point2D;
  b: Point2D;
  c: Point2D;

  constructor(a: Point2D, b: Point2D, c: Point2D) {
    this.a = a;
    this.b = b;
    this.c = c;
  }

  /**
   *
   * @returns the center of the triangle
   */
  center(): Point2D {
    return this.a
      .add(this.b)
      .add(this.c)
      .scale(1 / 3);
  }
}
