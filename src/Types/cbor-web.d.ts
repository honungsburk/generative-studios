// // https://hildjj.github.io/node-cbor/
declare module "cbor-web" {
  export type Value =
    | boolean
    | number
    | string
    | Value[]
    | Set<Value>
    | Map<string | number, Value>
    | undefined
    | Buffer
    | Date
    | RegExp
    | URL
    | BigInt;

  export function encode(...value: Value): Buffer;

  export function decodeAllCallback(
    error: Error,
    value: Array<ExtendedResults> | Array<any>
  );

  type DecoderOptions = {
    max_depth: number;
    tags: Tagged.TagMap;
    preferWeb: boolean;
    encoding: BufferEncoding;
    required: boolean;
    extendedResults: boolean;
    preventDuplicateKeys: boolean;
  };

  type ExtendedResults = {
    value: any;
    length: number;
    bytes: Buffer;
    unused: Buffer;
  };

  export function decodeAll(
    buffer: BufferLike,
    options?: DecoderOptions | decodeAllCallback | string,
    cb?: decodeAllCallback
  ): Promise<Array<ExtendedResults> | Array<any>>;
}
