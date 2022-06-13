import { expect, test } from "vitest";
import * as Split from "./Split";

test(`Can encode & decode Split.RANDOM`, () => {
  expect(Split.decode.tryParse(Split.encode(Split.RANDOM))).toEqual(
    Split.RANDOM
  );
});

test(`Can encode & decode Split.MIDDLE`, () => {
  expect(Split.decode.tryParse(Split.encode(Split.MIDDLE))).toEqual(
    Split.MIDDLE
  );
});

test(`Can encode & decode Split.RANDOM_BALANCED`, () => {
  expect(Split.decode.tryParse(Split.encode(Split.RANDOM_BALANCED))).toEqual(
    Split.RANDOM_BALANCED
  );
});

test(`Can not encode & decode Incorrect values`, () => {
  expect(() => Split.decode.tryParse("4")).throw();
});
