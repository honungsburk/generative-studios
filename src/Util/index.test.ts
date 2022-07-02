import { expect, test } from "vitest";
import * as index from "./index";

////////////////////////////////////////////////////////////////////////////////
// fitToDimensions
////////////////////////////////////////////////////////////////////////////////

test("fitToDimensions don't do anything when inside dimensions", () => {
  expect(index.fitToDimensions(100, 100, 10, 10)).toStrictEqual({
    width: 10,
    height: 10,
  });
});

test("fitToDimensions don't do anything when inside dimensions", () => {
  expect(index.fitToDimensions(1000, 1000, 1200, 1000)).toStrictEqual({
    width: 1000,
    height: Math.round((1000 * 5) / 6),
  });
});
