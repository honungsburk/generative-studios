import { Buffer } from "buffer";

export function encode(s: string): string {
  return Buffer.from(s, "utf8").toString("base64");
}

export function decode(s: string): any {
  return Buffer.from(s, "base64").toString("utf8");
}
