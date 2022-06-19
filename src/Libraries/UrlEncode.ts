import cbor from "cbor-web";
import { ConstrainedNumber } from "./ConstrainedNumber";
import { Set } from "immutable";
import * as Util from "src/Util";

// export type Settings = {
//   seed: string;
//   splittingStrategy: Split.Strategy;
//   depthStrategy: Depth.Strategy;
//   distStrategy: Distance.Strategy.Type;
//   jitter: Jitter.Jitter;
//   palette: PaletteP5.Cosine.Constraints.Palette;
//   symmetry: boolean;
// };

export type Value =
  | {
      [key: string]: Value;
    }
  | string
  | boolean
  | number
  | ConstrainedNumber<any, any, any>;

export function VConstrainedNumber<
  STEP extends number,
  MIN extends number,
  MAX extends number
>(
  value: (n: number) => ConstrainedNumber<STEP, MIN, MAX>
): VConstrainedNumber<STEP, MIN, MAX> {
  return {
    kind: "VConstrainedNumber",
    value: value,
  };
}

type VConstrainedNumber<
  STEP extends number,
  MIN extends number,
  MAX extends number
> = {
  readonly kind: "VConstrainedNumber";
  value: (n: number) => ConstrainedNumber<STEP, MIN, MAX>;
};
export const VNumber: VNumber = { kind: "VNumber" };
type VNumber = { readonly kind: "VNumber" };
export const VBoolean: VBoolean = { kind: "VBoolean" };
type VBoolean = { readonly kind: "VBoolean" };
export const VString: VString = { kind: "VString" };
type VString = { readonly kind: "VString" };
export const VEnumString = (values: Iterable<string> | ArrayLike<string>) =>
  ({
    kind: "VEnumString",
    value: Set(values),
  } as VEnumString);
type VEnumString = { readonly kind: "VEnumString"; value: Set<String> };

export function VObject(value: { [key: string]: ValueSchema }): VObject {
  return {
    kind: "VObject",
    value: value,
  };
}
type VObject = {
  kind: "VObject";
  value: { [key: string]: ValueSchema };
};

export type ValueSchema =
  | VObject
  | VString
  | VEnumString
  | VBoolean
  | VNumber
  | VConstrainedNumber<any, any, any>;

/**
 *
 * @param schema the schema to validate against
 * @param value the value to validate
 * @returns whether or not the value mataches the schema
 */
export const validate = (schema: ValueSchema) => (value: Value) => {
  switch (schema.kind) {
    case "VBoolean":
      return typeof value === "boolean";
    case "VNumber":
      return typeof value === "number";
    case "VString":
      return typeof value === "string";
    case "VConstrainedNumber":
      if (value instanceof ConstrainedNumber) {
        const testObj = schema.value(1.0);
        return (
          testObj.max === value.max &&
          testObj.min === value.min &&
          testObj.step === value.step
        );
      } else {
        return false;
      }
    case "VEnumString":
      return typeof value === "string" && schema.value.includes(value);
    case "VObject":
      if (typeof value === "object") {
        const v = value as {
          [key: string]: Value;
        };

        if (!Util.objectsHaveSameKeys(schema.value, v)) {
          return false;
        }
        for (let key in schema.value) {
          if (!validate(schema.value[key])(v[key])) {
            return false;
          }
        }
        return true;
      } else {
        return false;
      }
  }
};

/**
 * NOTE: will throw errors if you try to encode an Value not matching the ValueSchema
 *
 * @param schema the schema from which to construct encoder/decoder
 * @returns a decoder/encoder pair
 */
export function construct(schema: ValueSchema): {
  encode: (value: Value) => string;
  decode: (s: string) => Value;
} {
  return {
    encode: (value) => "",
    decode: (s) => true,
  };
}

/**
 *
 * @param value the value you want to encode
 * @returns a base64 encoded string storing the state
 */
export function encode(value: any): string {
  return cbor.encode(value).toString("base64");
}

/**
 *
 * @param s the base64 encoded string storing the state
 * @returns whatever you encoded
 */
export async function decode(s: string): Promise<any> {
  const res = await cbor.decodeAll(Buffer.from(s, "base64"));
  return res[0];
}
