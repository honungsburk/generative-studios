import { Buffer } from "buffer";

export function encode(artConfig: any): string {
  return Buffer.from(JSON.stringify(artConfig), "utf8").toString("base64");
}

export function decode(artConfig: string): any {
  return JSON.parse(Buffer.from(artConfig, "base64").toString("utf8"));
}
