import cbor from "cbor-web";
import { ConstrainedNumber } from "./ConstrainedNumber";

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

type VConstrainedNumber = {
  kind: "VConstrainedNumber";
  value: (n: number) => ConstrainedNumber<any, any, any>;
};
type VNumber = { kind: "VNumber" };
type VBoolean = { kind: "VBoolean" };
type VString = { kind: "VString" };
type VEnumString = { kind: "VEnumString"; value: string[] };

export type ValueScheme =
  | {
      [key: string]: ValueScheme;
    }
  | VString
  | VEnumString
  | VBoolean
  | VNumber
  | VConstrainedNumber;

export function mkEncode() {}

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
