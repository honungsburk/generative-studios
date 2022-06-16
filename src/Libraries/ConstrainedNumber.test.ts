import { expect, test } from "vitest";
import {
  ConstrainedNumber,
  fromInt,
  fromNumber,
  Constraint,
} from "./ConstrainedNumber";

const constraint: Constraint<0.01, 0, 1> = { min: 0, max: 1, step: 0.01 };

test("Constrained numbers are can not be lower then their min", () => {
  const n = new ConstrainedNumber(-10, constraint);
  expect(n.value).toEqual(n.min);
});

test("Constrained numbers are can not be larger then their max", () => {
  const n = new ConstrainedNumber(10, constraint);
  expect(n.value).toEqual(n.max);
});

test("Adding numbers are still in the range", () => {
  const n1 = new ConstrainedNumber(0.01, constraint);
  const n2 = new ConstrainedNumber(0.1, constraint);
  expect(n1.add(n2).value).toEqual(0.11);
});

test("Subtracting numbers are still in the range", () => {
  const n1 = new ConstrainedNumber(0.01, constraint);
  const n2 = new ConstrainedNumber(0.1, constraint);
  expect(n2.sub(n1).value).toEqual(0.09);
});

test("Can roundtrip ints", () => {
  const n1 = new ConstrainedNumber(0.01, constraint);
  expect(fromInt(constraint)(n1.asInt()).value).toEqual(n1.value);
});

test("Can encode to int", () => {
  const n1 = new ConstrainedNumber(0.01, constraint);
  expect(n1.asInt()).toEqual(1);
});

test("Is snapped to step", () => {
  const n1 = new ConstrainedNumber(0.896, constraint);
  expect(n1.asInt()).toEqual(90);
});
