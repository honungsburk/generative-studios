import * as MathExtra from "./MathExtra";

export function fromNumber<
  STEP extends number,
  MIN extends number,
  MAX extends number
>(
  step: STEP,
  min: MIN,
  max: MAX
): (value: number) => ConstrainedNumber<STEP, MIN, MAX> {
  return (v) => new ConstrainedNumber(v, step, min, max);
}

export function fromInt<
  STEP extends number,
  MIN extends number,
  MAX extends number
>(
  step: STEP,
  min: MIN,
  max: MAX
): (int: number) => ConstrainedNumber<STEP, MIN, MAX> {
  return (int) => new ConstrainedNumber(int * step, step, min, max);
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
  private _step: STEP;
  private _value: number;
  private _min: MIN;
  private _max: MAX;

  constructor(value: number, step: STEP, min: MIN, max: MAX) {
    this._step = step;
    this._min = min;
    this._max = max;
    this._value = MathExtra.round(step)(MathExtra.bound(min, max)(value));
  }

  add(
    other: ConstrainedNumber<STEP, MIN, MAX>
  ): ConstrainedNumber<STEP, MIN, MAX> {
    return new ConstrainedNumber(
      this.value + other.value,
      this.step,
      this.min,
      this.max
    );
  }

  subtract(
    other: ConstrainedNumber<STEP, MIN, MAX>
  ): ConstrainedNumber<STEP, MIN, MAX> {
    return new ConstrainedNumber(
      this.value - other.value,
      this.step,
      this.min,
      this.max
    );
  }

  public get value(): number {
    return this._value;
  }

  public get step(): STEP {
    return this._step;
  }

  public get min(): MIN {
    return this._min;
  }

  public get max(): MAX {
    return this._max;
  }

  asInt(): number {
    return this.value / this.step;
  }
}
