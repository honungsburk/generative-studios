import { expect, test } from "vitest";
import * as StainedGlassAlg from "src/Pages/StainedGlass/Algorithm";
import * as ArtLink from "./ArtLink";

test("Can encode random string", () => {
  const config = StainedGlassAlg.generateSettings("123");
  const base64string = ArtLink.encode(config);
  const otherConfig = ArtLink.decode(base64string);
  expect(config.depthStrategy).toEqual(otherConfig.depthStrategy);
});
