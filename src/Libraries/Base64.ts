import { Buffer } from "buffer";

/**
 *
 * @param s a normal string that you want to base64 encode
 * @returns the same string but encoded in base64
 */
export function encode(s: string): string {
  return Buffer.from(s, "utf8").toString("base64");
}

/**
 *
 * @param s the base64 string to decode
 * @returns the same string but normal again
 */
export function decode(s: string): string {
  return Buffer.from(s, "base64").toString("utf8");
}
