/**
 * A point in 2d
 */
export default class Point2D {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   *
   * @param {Point2D} other the other point to add
   * @returns a new Point2D
   */
  add(other: Point2D) {
    return new Point2D(this.x + other.x, this.y + other.y);
  }

  /**
   *
   * @param {Point2D} other the other point to subtract
   * @returns a new Point2D
   */
  minus(other: Point2D) {
    return new Point2D(this.x - other.x, this.y - other.y);
  }

  /**
   *
   * @param {number} factor to scale the point with
   * @returns a new Point2D
   */
  scale(factor: number) {
    return new Point2D(this.x * factor, this.y * factor);
  }

  /**
   *
   * @param {Point2D} other
   */
  distance_to(other: Point2D) {
    return Math.sqrt(
      Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2)
    );
  }
}
