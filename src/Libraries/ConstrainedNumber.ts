import * as MathExtra from "./MathExtra";

export type Constraint<
  STEP extends number,
  MIN extends number,
  MAX extends number
> = {
  step: STEP;
  min: MIN;
  max: MAX;
};

export function fromNumber<
  STEP extends number,
  MIN extends number,
  MAX extends number
>(
  constraint: Constraint<STEP, MIN, MAX>
): (value: number) => ConstrainedNumber<STEP, MIN, MAX> {
  return (v) => new ConstrainedNumber(v, constraint);
}

export function fromInt<
  STEP extends number,
  MIN extends number,
  MAX extends number
>(
  constraint: Constraint<STEP, MIN, MAX>
): (int: number) => ConstrainedNumber<STEP, MIN, MAX> {
  return (int) => new ConstrainedNumber(int * constraint.step, constraint);
}

/**
 * Constrained numbers have a given number of decimal places as well as a min and
 * max value. Their pirpose is to constrain our artworks to work defined set of parameters
 * so that they don't go outside does bounds and that it is small to deserialize
 */
export class ConstrainedNumber<
  STEP extends number,
  MIN extends number,
  MAX extends number
> {
  private _value: number;
  private _constraint;

  constructor(value: number, constraint: Constraint<STEP, MIN, MAX>) {
    this._constraint = constraint;
    this._value = MathExtra.round(constraint.step)(
      MathExtra.bound(constraint.min, constraint.max)(value)
    );
  }

  add(
    other: ConstrainedNumber<STEP, MIN, MAX>
  ): ConstrainedNumber<STEP, MIN, MAX> {
    return new ConstrainedNumber(this.value + other.value, this.constraint);
  }

  sub(
    other: ConstrainedNumber<STEP, MIN, MAX>
  ): ConstrainedNumber<STEP, MIN, MAX> {
    return new ConstrainedNumber(this.value - other.value, this.constraint);
  }

  fromNumber(value: number): ConstrainedNumber<STEP, MIN, MAX> {
    return new ConstrainedNumber(value, this.constraint);
  }

  fromInt(value: number): ConstrainedNumber<STEP, MIN, MAX> {
    return new ConstrainedNumber(value * this.constraint.step, this.constraint);
  }

  public get value(): number {
    return this._value;
  }

  public get constraint(): Constraint<STEP, MIN, MAX> {
    return this._constraint;
  }

  public get step(): STEP {
    return this._constraint.step;
  }

  public get min(): MIN {
    return this._constraint.min;
  }

  public get max(): MAX {
    return this._constraint.max;
  }

  /**
   *
   * To reduce size when encoded using CBOR we convert the values to ints
   *
   * @returns an int to be encoded using CBOR
   */
  asInt(): number {
    return this.value / this.step;
  }
}
