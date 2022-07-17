import * as cbor from "cbor-web";
import * as ConstrainedNumber from "./ConstrainedNumber";
import { Set } from "immutable";
import * as Util from "src/Util";
import KeyCharMap from "src/Util/KeyCharMap";
import { CustomError } from "ts-custom-error";
import { Buffer } from "buffer";

export type Value =
  | {
      [key: string]: Value;
    }
  | string
  | boolean
  | number
  | Value[]
  | ConstrainedNumber.ConstrainedNumber<any, any, any>;

export function VConstrainedNumber<
  STEP extends number,
  MIN extends number,
  MAX extends number
>(
  value: ConstrainedNumber.Constraint<STEP, MIN, MAX>
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
  value: ConstrainedNumber.Constraint<STEP, MIN, MAX>;
};
export const VNumber: VNumber = { kind: "VNumber" };
type VNumber = { readonly kind: "VNumber" };
export const VBoolean: VBoolean = { kind: "VBoolean" };
type VBoolean = { readonly kind: "VBoolean" };
export const VString: VString = { kind: "VString" };
type VString = { readonly kind: "VString" };

export const VEnumString = (values: Iterable<string> | ArrayLike<string>) => {
  if (typeof values !== "string") {
    return {
      kind: "VEnumString",
      value: Set(values),
    } as VEnumString;
  } else {
    throw Error(
      `VEnumString was given a string but that is not a valid argument, try [${values}]`
    );
  }
};
type VEnumString = { readonly kind: "VEnumString"; value: Set<string> };

export function VArray(value: ValueSchema): VArray {
  return {
    kind: "VArray",
    value: value,
  };
}

type VArray = {
  kind: "VArray";
  value: ValueSchema;
};

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

type VOr = {
  kind: "VOr";
  value: ValueSchema[];
};

export function VOr(value: ValueSchema[]): VOr {
  return {
    kind: "VOr",
    value: value,
  };
}

export type ValueSchema =
  | VObject
  | VString
  | VEnumString
  | VBoolean
  | VNumber
  | VArray
  | VConstrainedNumber<any, any, any>
  | VOr;

/**
 *
 * @param schema the schema to validate against
 * @param value the value to validate
 * @returns whether or not the value mataches the schema
 */
export const validate = (schema: ValueSchema) => (value: Value) => {
  try {
    validateWithErr(schema)(value);
    return true;
  } catch (err) {
    return false;
  }
};

export class IncorrectTypeError extends CustomError {
  public constructor(public schemaKind: string, public valueKind: string) {
    super(`Expected '${schemaKind}' but got '${valueKind}'`);
  }
}

export class InvalidKeyError extends CustomError {
  public constructor(public key: string) {
    super(`Key '${key}' is not present  in the schema`);
  }
}

/**
 * throws an error if there isn't a match
 *
 * @param schema the schema to validate against
 * @param value the value to validate
 */
export const validateWithErr = (schema: ValueSchema) => (value: Value) => {
  let isValid = false;
  switch (schema.kind) {
    case "VArray":
      if (
        Array.isArray(value) &&
        value.every((v) => validateWithErr(schema.value)(v))
      ) {
        return true;
      }
      throw new IncorrectTypeError("VArray", typeof value);
    case "VOr":
      for (let sch of schema.value) {
        try {
          if (!isValid && validateWithErr(sch)(value)) {
            isValid = true;
          }
        } catch (err) {}
      }
      if (!isValid) {
        throw new IncorrectTypeError(
          `VOr [${schema.value.map((v) => JSON.stringify(v)).join(", ")}]`,
          JSON.stringify(value)
        );
      }
      return true;
    case "VBoolean":
      if (typeof value !== "boolean") {
        throw new IncorrectTypeError("VBoolean", typeof value);
      }
      return true;
    case "VNumber":
      if (typeof value !== "number") {
        throw new IncorrectTypeError("VNumber", typeof value);
      }
      return true;
    case "VString":
      if (typeof value !== "string") {
        throw new IncorrectTypeError("VString", typeof value);
      }
      return true;
    case "VConstrainedNumber":
      isValid = false;
      if (value instanceof ConstrainedNumber.ConstrainedNumber) {
        isValid =
          schema.value.max === value.max &&
          schema.value.min === value.min &&
          schema.value.step === value.step;
      }
      if (!isValid) {
        throw new IncorrectTypeError("VConstrainedNumber", typeof value);
      }
      return true;
    case "VEnumString":
      if (!(typeof value === "string" && schema.value.includes(value))) {
        throw new IncorrectTypeError("VString", typeof value);
      }
      return true;
    case "VObject":
      isValid = false;
      if (typeof value === "object") {
        const v = value as {
          [key: string]: Value;
        };

        if (!Util.objectsHaveSameKeys(schema.value, v)) {
          throw new Error("Found key that is not part of schema");
        }
        for (let key in schema.value) {
          if (!validateWithErr(schema.value[key])(v[key])) {
            throw new Error("Value did not match");
          }
        }
        isValid = true;
      }

      if (!isValid) {
        throw new IncorrectTypeError("VObject", typeof value);
      }
      return true;
  }
};

export function keyShrink(schema: ValueSchema): {
  encode: (value: Value) => Value;
  decode: (value: Value) => Value;
  schema: ValueSchema;
} {
  if (schema.kind === "VArray") {
    const rec = keyShrink(schema.value);
    return {
      schema: VArray(rec.schema),
      encode: (v) => {
        if (Array.isArray(v)) {
          return v.map(rec.encode);
        } else {
          throw Error(`Expected ${v} to be an Array`);
        }
      },
      decode: (v) => {
        if (Array.isArray(v)) {
          return v.map(rec.decode);
        } else {
          throw Error(`Expected ${v} to be an Array`);
        }
      },
    };
  } else if (schema.kind === "VObject") {
    const keys = Object.keys(schema.value).sort();
    const compress: any = {};
    const compressor = new KeyCharMap(keys);
    const newSchema: any = {};

    for (let key of keys) {
      compress[key] = keyShrink(schema.value[key]);
      newSchema[compressor.keyToChar(key)] = compress[key].schema;
    }

    return {
      schema: VObject(newSchema),
      encode: (v) => {
        if (
          typeof v === "object" &&
          !(v instanceof ConstrainedNumber.ConstrainedNumber) &&
          !Array.isArray(v)
        ) {
          const newV: any = {};
          for (let key of keys) {
            newV[compressor.keyToChar(key)] = compress[key].encode(v[key]);
          }

          return newV;
        } else {
          throw Error(`Expected ${v} to be an object`);
        }
      },
      decode: (v) => {
        if (
          typeof v === "object" &&
          !(v instanceof ConstrainedNumber.ConstrainedNumber) &&
          !Array.isArray(v)
        ) {
          const newV: any = {};
          for (let char in v) {
            const key = compressor.charToKey(char);
            newV[key] = compress[key].decode(v[char]);
          }

          return newV;
        } else {
          throw Error(`Expected ${v} to be an object`);
        }
      },
    };
  } else if (schema.kind === "VOr") {
    const shrinks = schema.value.map(keyShrink);
    return {
      schema: VOr(shrinks.map((s) => s.schema)),
      encode: (v) => {
        let index = 0;
        for (let sch of schema.value) {
          if (validate(sch)(v)) {
            return shrinks[index].encode(v);
          }
          index++;
        }

        throw Error(
          `Expected ${v} to match any of '${schema.value
            .map((v) => v.kind)
            .join(", ")}'`
        );
      },
      decode: (v) => {
        let index = 0;

        for (let sch of schema.value) {
          try {
            const value = shrinks[index].decode(v);
            // If the value is a different refrence we know that some transformation was applied
            // transformations are correct if they succeed so we can return
            if (validate(sch)(value)) {
              return value;
            }
          } catch (e: any) {}
          index++;
        }

        return v;
      },
    };
  } else {
    return {
      encode: (e) => e,
      decode: (e) => e,
      schema: schema,
    };
  }
}

export function valueCompress(schema: ValueSchema): {
  encode: (value: Value) => Value;
  decode: (value: Value) => Value;
} {
  const pair = valueCompressUnsafe(schema);
  return {
    encode: (value: Value) => {
      if (validate(schema)(value)) {
        return pair.encode(value);
      }

      throw Error("Did not match schema when encoding!");
    },
    decode: (value: Value) => {
      const newV = pair.decode(value);
      if (validate(schema)(newV)) {
        return newV;
      }
      throw Error("Did not match schema when decoding!");
    },
  };
}

// WARNING: will change the schema for VOR to a VObject
function valueCompressUnsafe(schema: ValueSchema): {
  encode: (value: Value) => Value;
  decode: (value: Value) => Value;
} {
  if (schema.kind === "VArray") {
    const compressor = valueCompressUnsafe(schema.value);
    return {
      encode: (v) => {
        if (Array.isArray(v)) {
          return v.map(compressor.encode);
        } else {
          throw Error(`Expected ${v} to be an array`);
        }
      },
      decode: (v) => {
        if (Array.isArray(v)) {
          return v.map(compressor.decode);
        } else {
          throw Error(`Expected ${v} to be an array`);
        }
      },
    };
  } else if (schema.kind === "VObject") {
    const keys = Object.keys(schema.value).sort();
    const compress: any = {};

    for (let key of keys) {
      compress[key] = valueCompress(schema.value[key]);
    }

    return {
      encode: (v) => {
        if (
          typeof v === "object" &&
          !(v instanceof ConstrainedNumber.ConstrainedNumber) &&
          !Array.isArray(v)
        ) {
          const newV: any = {};
          for (let key of keys) {
            newV[key] = compress[key].encode(v[key]);
          }

          return newV;
        } else {
          throw Error(`Expected ${v} to be an object`);
        }
      },
      decode: (v) => {
        if (
          typeof v === "object" &&
          !(v instanceof ConstrainedNumber.ConstrainedNumber) &&
          !Array.isArray(v)
        ) {
          const newV: any = {};
          for (let key of keys) {
            newV[key] = compress[key].decode(v[key]);
          }

          return newV;
        } else {
          throw Error(`Expected ${v} to be an object`);
        }
      },
    };
  } else if (schema.kind === "VEnumString") {
    const compressor = new KeyCharMap(schema.value);

    return {
      encode: (v) => {
        if (typeof v === "string") {
          return compressor.keyToChar(v);
        } else {
          throw Error(`Expected ${v} to be a string`);
        }
      },
      decode: (v) => {
        if (typeof v === "string") {
          return compressor.charToKey(v);
        } else {
          throw Error(`Expected ${v} to be a string`);
        }
      },
    };
  } else if (schema.kind === "VConstrainedNumber") {
    return {
      encode: (v) => {
        if (v instanceof ConstrainedNumber.ConstrainedNumber) {
          return v.asInt();
        } else {
          throw Error(`Expected ${v} to be a ConstrainedNumber`);
        }
      },
      decode: (v) => {
        if (typeof v === "number") {
          return ConstrainedNumber.fromInt(schema.value)(v);
        } else {
          throw Error(`Expected ${v} to be a Number`);
        }
      },
    };
  } else if (schema.kind === "VOr") {
    const pairs = schema.value.map(valueCompress);
    return {
      encode: (v) => {
        let index = 0;
        for (let pair of pairs) {
          try {
            return {
              v: pair.encode(v),
              i: index,
            };
          } catch (err) {}
          index++;
        }

        throw Error(
          `Expected ${v} to match any of '${schema.value
            .map((v) => v.kind)
            .join(", ")}'`
        );
      },
      decode: (v) => {
        if (
          typeof v === "object" &&
          !(v instanceof ConstrainedNumber.ConstrainedNumber) &&
          !Array.isArray(v)
        ) {
          const index = v["i"] as number;
          return pairs[index].decode(v["v"]);
        }
        throw Error("Expected on object of shape { i : number, v : Value}");
      },
    };
  } else {
    return {
      encode: (v) => v,
      decode: (v) => v,
    };
  }
}

/**
 * NOTE: will throw errors if you try to encode an Value not matching the ValueSchema
 *
 * @param schema the schema from which to construct encoder/decoder
 * @returns a decoder/encoder pair
 */
export function construct(schema: ValueSchema): {
  encode: (value: Value) => string;
  decode: (s: string) => Promise<Value>;
} {
  const validator = validateWithErr(schema);
  const keyC = keyShrink(schema);
  const valueC = valueCompress(keyC.schema);

  return {
    encode: (value) => {
      if (!validator(value)) {
        throw Error("Value did not match the schema!");
      }

      return encodeCBOR(valueC.encode(keyC.encode(value)));
    },
    decode: async (s) => {
      const r = await decodeCBOR(s);
      const value = keyC.decode(valueC.decode(r));
      if (!validator(value)) {
        throw Error("Value did not match the schema!");
      }
      return value;
    },
  };
}

/**
 *
 * @param value the value you want to encode
 * @returns a base64 encoded string storing the state
 */
export function encodeCBOR(value: any): string {
  return cbor.encode(value).toString("base64");
}

/**
 *
 * @param s the base64 encoded string storing the state
 * @returns whatever you encoded
 */
export async function decodeCBOR(s: string): Promise<any> {
  const res = await cbor.decodeAll(Buffer.from(s, "base64"));
  return res[0];
}
