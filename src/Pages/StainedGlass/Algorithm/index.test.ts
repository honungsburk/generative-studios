import { expect, test } from "vitest";
import * as Algorithm from "./index";

test("Stained Glass encode/decode roundtrip", async () => {
  const settings = Algorithm.generateSettings("seed");
  const res1 = Algorithm.encode(settings);
  const res = await Algorithm.decode(res1);
  expect(res).toStrictEqual(settings);
});
