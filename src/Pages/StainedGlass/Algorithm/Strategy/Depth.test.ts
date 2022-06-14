import { expect, test } from "vitest";
import * as Depth from "./Depth";

test(`Can encode & decode Depth.MaxDepthStrategy`, () => {
  expect(
    Depth.decode.tryParse(Depth.encode(new Depth.MaxDepthStrategy(3)))
  ).toEqual(new Depth.MaxDepthStrategy(3));
});

test(`Can encode & decode Depth.InheritedDepthStrategy`, () => {
  expect(
    Depth.decode.tryParse(Depth.encode(new Depth.InheritedDepthStrategy(3)))
  ).toEqual(new Depth.InheritedDepthStrategy(3));
});

test(`Can encode & decode Depth.FlipDepthStrategy`, () => {
  expect(
    Depth.decode.tryParse(Depth.encode(new Depth.FlipDepthStrategy(0.1, 3)))
  ).toEqual(new Depth.FlipDepthStrategy(0.1, 3));
});
