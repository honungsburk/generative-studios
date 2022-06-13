import { expect, test } from "vitest";
import * as Distance from "./Distance";

test(`Can encode & decode Distance.Strategy.XCentroid`, () => {
  expect(
    Distance.decode.tryParse(Distance.encode(Distance.Strategy.XCentroid))
  ).toEqual(Distance.Strategy.XCentroid);
});

test(`Can encode & decode Distance.Strategy.YCentroid`, () => {
  expect(
    Distance.decode.tryParse(Distance.encode(Distance.Strategy.YCentroid))
  ).toEqual(Distance.Strategy.YCentroid);
});

test(`Can encode & decode Distance.Strategy.DistanceToPoint`, () => {
  expect(
    Distance.decode.tryParse(
      Distance.encode(Distance.Strategy.DistanceToPoint(0.5, 0.5))
    )
  ).toEqual(Distance.Strategy.DistanceToPoint(0.5, 0.5));
});
