import { expect, test } from "vitest";
import * as Uniform from "./Uniform";

////////////////////////////////////////////////////////////////////////////////
// isF3
////////////////////////////////////////////////////////////////////////////////

test("isF1 works as expected", () => {
  expect(Uniform.isF1([1.0])).toEqual(true);
  expect(Uniform.isF1([1.0, 1.9])).toEqual(false);
  expect(Uniform.isF1([1.0, 1.9, -1.0])).toEqual(false);
});

test("isF2 works as expected", () => {
  expect(Uniform.isF2([1.0])).toEqual(false);
  expect(Uniform.isF2([1.0, 1.9])).toEqual(true);
  expect(Uniform.isF2([1.0, 1.9, -1.0])).toEqual(false);
});

test("isF3 works as expected", () => {
  expect(Uniform.isF3([1.0])).toEqual(false);
  expect(Uniform.isF3([1.0, 1.9])).toEqual(false);
  expect(Uniform.isF3([1.0, 1.9, -1.0])).toEqual(true);
});

test("equals works as expected", () => {
  expect(Uniform.equals([1.0], [1.0, 1.0])).toEqual(false);
  expect(Uniform.equals([1.0], [1.0])).toEqual(true);
  expect(Uniform.equals([1.0, 1.0], [1.0, 1.0])).toEqual(true);
  expect(Uniform.equals([1.1], [1.11])).toEqual(false);

  expect(Uniform.equals([1.0, 1.0, 1.0], [1.0, 1.0, 1.1])).toEqual(false);
  expect(Uniform.equals([1.0, 1.0, 1.1], [1.0, 1.0, 1.1])).toEqual(true);
});
