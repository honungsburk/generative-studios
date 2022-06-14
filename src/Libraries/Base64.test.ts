import { expect, test } from "vitest";
import * as Base64 from "./Base64";

test("Can encode a string", () => {
  expect(Base64.decode(Base64.encode("Hello"))).toEqual("Hello");
});
