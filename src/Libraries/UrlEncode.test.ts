import { expect, test } from "vitest";
import * as UrlEncode from "./UrlEncode";

test("Can encode a string", () => {
  expect(UrlEncode.decode(UrlEncode.encode("Hello"))).resolves.toEqual("Hello");
});
