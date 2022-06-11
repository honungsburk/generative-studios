import { Buffer } from "buffer";

export function encode(artConfig: any): string {
  return Buffer.from(JSON.stringify(artConfig), "utf8").toString("base64url");
}

export function decode(artConfig: string): any {
  return JSON.parse(Buffer.from(artConfig, "base64url").toString("utf8"));
}
