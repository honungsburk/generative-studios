import { expect, test } from "vitest";
import KeyCharMap from "./KeyCharMap";

test("KeyCharMap can map backa and forth", () => {
  const map = new KeyCharMap(["hello", "no", "what", "fo"]);

  expect(map.keyToChar("hello").length).toEqual(1);
  expect(map.charToKey(map.keyToChar("hello"))).toEqual("hello");
});

test("KeyCharMap can throws error on unknown", () => {
  const map = new KeyCharMap(["hello", "no", "what", "fo"]);

  expect(() => map.keyToChar("c")).toThrow();
  expect(() => map.charToKey("1123")).toThrow();
});
