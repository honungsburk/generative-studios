import { RNG } from "src/Libraries/Random";
import Point2D from "./Point2D";
import Triangle from "./Triangle";
import p5Types from "p5";
import * as Palette from "src/Libraries/P5Extra/Palette";
import * as P from "parsimmon";

import {
  DistanceStrategy,
  DistanceStrategyFn,
  generateDistStrategy,
  getDistStrategyFn,
} from "./Strategy/Distance";
import { genJitterFn, JitterFn } from "./Strategy/Jitter";
import {
  generateSplitStrat,
  getSplitStratFn,
  SplitStrategy,
  SplitStrategyFn,
} from "./Strategy/Split";
import {
  DepthStrategy,
  DepthStrategyFn,
  generateDepthStrategy,
  getDepthStrategyFn,
} from "./Strategy/Depth";
import { generatePalette } from "./Strategy/Palette";

////////////////////////////////////////////////////////////////////////////////
// Seed
////////////////////////////////////////////////////////////////////////////////

/**
 *
 * @returns a seed to be used to create the artwork
 */
export function generateSeed(): string {
  return Math.random().toString().substr(2, 8);
}

/**
 *
 * @param rng random number generator
 * @returns
 */
export function generateSettings(seed: string): Settings {
  let rng = new RNG(seed);
  return {
    seed: seed,
    splittingStrategy: generateSplitStrat(rng),
    depthStrategy: generateDepthStrategy(rng),
    distStrategy: generateDistStrategy(rng),
    jitter: rng.pickUniform([0, 0, 0, 0.05, 0.005, 0.1, 0.4]),
    palette: generatePalette(rng),
    symmetry: rng.bernoulli(0.3),
  };
}

////////////////////////////////////////////////////////////////////////////////
// Settings
////////////////////////////////////////////////////////////////////////////////

/**
 * Settings you can play with to influence the algorithm
 */
export type Settings = {
  seed: string;
  splittingStrategy: SplitStrategy;
  depthStrategy: DepthStrategy;
  distStrategy: DistanceStrategy;
  jitter: number;
  palette: Palette.CosinePalette;
  symmetry: boolean;
};

export function encode(settings: Settings): string {
  return "";
}

////////////////////////////////////////////////////////////////////////////////
// Entry Points
////////////////////////////////////////////////////////////////////////////////

/**
 * The setup function is run before anything else.
 */
export const setup =
  (width: number, height: number) =>
  (p5: p5Types, canvasParentRef: Element) => {
    /**
     * Using SVG leads to smaller image sizes + infinite resolution! Perfect
     * when creating an NFT.
     */
    // createCanvas(CANVAS_SIZE_X, CANVAS_SIZE_Y, SVG)
    // Since we want a static image we will turn off the looping.
    p5.createCanvas(width, height).parent(canvasParentRef);
    p5.loop();
    p5.rectMode(p5.CENTER); //??? can be removed???
  };

export const draw = () => {
  let lastSettings: Settings | undefined = undefined;
  let lastWidth: number = 0;
  let lastHeight: number = 0;

  return (settings: Settings, width: number, height: number) =>
    (p5: p5Types) => {
      // Only update if any dependency has changed
      if (
        lastSettings !== settings ||
        width !== lastWidth ||
        height !== lastHeight
      ) {
        lastSettings = settings;
        lastWidth = width;
        lastHeight = height;
        /**
         * We start by defining some pre-requisites for the split triangle algorithm.
         * An immediate problem occurs: an image is a rectangle but our algorithm can only
         * deal with triangles. To fix this issue we can simply split the image into
         * two triangles.
         *
         * We will also be using relative coordinates and then simply scale them when
         * we are drawing the final image.
         */
        let a = new Point2D(0, 0);
        let b = new Point2D(1, 0);
        let c = new Point2D(0, 1);
        let d = new Point2D(1, 1);
        let t1 = new Triangle(a, b, c);
        let t2 = new Triangle(d, b, c);

        let rng = new RNG(settings.seed);

        let split_strat = getSplitStratFn(rng, settings.splittingStrategy);
        let depth_strat = getDepthStrategyFn(rng, settings.depthStrategy);
        let dist_strat = getDistStrategyFn(settings.distStrategy);
        let jitter = genJitterFn(rng, settings.jitter);
        let palette = Palette.cosine_palette(p5)(
          settings.palette.red,
          settings.palette.green,
          settings.palette.blue,
          settings.palette.mode
        );

        // Construct the upper triangle of the image
        let st1 = new SmartTree(t1, split_strat, depth_strat, 0);
        st1.split();

        st1.dfs(
          draw_color_leaf(p5, dist_strat, jitter, palette, width, height)
        );

        /**
         * 30% of the time we reset the random number generator. This causes the two
         * triangles that make our image identical. Humans like symmetry :)
         *
         * Why are the strategies also created again if they are just will end up being the same
         * you ask? Well, it is because we need the get the random number generator
         * to the correct state when it builds the image and draws the tree.
         */
        if (settings.symmetry) {
          console.log("symmetric");
          rng = new RNG(settings.seed);
          split_strat = getSplitStratFn(rng, settings.splittingStrategy);
          depth_strat = getDepthStrategyFn(rng, settings.depthStrategy);
          dist_strat = getDistStrategyFn(settings.distStrategy);
          jitter = genJitterFn(rng, settings.jitter);
          palette = Palette.cosine_palette(p5)(
            settings.palette.red,
            settings.palette.green,
            settings.palette.blue,
            settings.palette.mode
          );
        }

        // Construct the lower triangle of the image
        let st2 = new SmartTree(t2, split_strat, depth_strat, 0);
        st2.split();

        st2.dfs(
          draw_color_leaf(p5, dist_strat, jitter, palette, width, height)
        );
      }
    };
};

////////////////////////////////////////////////////////////////////////////////
// Split Strategy
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Draw
////////////////////////////////////////////////////////////////////////////////

/**
 *
 * @param {p5Types} rng the random number generator
 * @param {RNG} rng the random number generator
 * @param {number} size_x the pixel size of the final image in the x direction
 * @param {number} size_y the pixel size of the final image in the y direction
 * @param {DistanceStrategyFn} distance the function used to calculate the distance which decides the color
 * @param {JitterFn} jitter adds jitter to the distance
 * @param {*} palette call back that given a number spits out a color
 * @param {Color} strokeColor given a color returns a color
 * @param {number} strokeW the stroke width of each triangle
 * @returns
 */
function draw_color_leaf(
  p5: p5Types,
  distance: DistanceStrategyFn,
  jitter: JitterFn,
  palette: (t: number) => p5Types.Color,
  width: number,
  height: number
) {
  return (smartTree: SmartTree) => {
    if (smartTree.isLeaf()) {
      let x1 = smartTree.triangle.a.x * width;
      let x2 = smartTree.triangle.b.x * width;
      let x3 = smartTree.triangle.c.x * width;
      let y1 = smartTree.triangle.a.y * height;
      let y2 = smartTree.triangle.b.y * height;
      let y3 = smartTree.triangle.c.y * height;

      let color = palette(jitter(distance(smartTree.triangle)) * 3);

      p5.fill(color);
      p5.stroke(color);
      // p5.strokeWeight(strokeW);
      p5.triangle(x1, y1, x2, y2, x3, y3);
    }
  };
}

////////////////////////////////////////////////////////////////////////////////
// Smart Tree
////////////////////////////////////////////////////////////////////////////////

/**
 * Performs the recursive splitting of triangles. It takes two call backs:
 * split_strategy and depth_strategy. That allow us to reuse the class for
 * multiple different approaches.
 */
class SmartTree {
  children: SmartTree[] = [];
  triangle: Triangle;
  split_strategy: SplitStrategyFn;
  depth_strategy: DepthStrategyFn;
  depth: number;

  constructor(
    triangle: Triangle,
    split_strategy: SplitStrategyFn,
    depth_strategy: DepthStrategyFn,
    depth: number
  ) {
    this.triangle = triangle;
    this.split_strategy = split_strategy;
    this.depth_strategy = depth_strategy;
    this.depth = depth;
  }

  /**
   * Recursively split the entire smart tree, will split forever if the depth_strategy
   * allows it.
   */
  split() {
    let res = this.depth_strategy(this.depth);
    if (res.result) {
      for (const sub_triangle of this.split_strategy(this.triangle)) {
        let st = new SmartTree(
          sub_triangle,
          this.split_strategy,
          res.callBack as any,
          this.depth + 1
        );
        st.split();
        this.children.push(st);
      }
    }
  }

  /**
   * the action is executed on the leafs first
   * The action gets access to the smart tree. Pro Tip: Do not modify the smart tree!!!
   *
   * @param {function(SmartTree)} action function to call while exploring the tree
   */
  dfs(action: (smartTree: SmartTree) => void) {
    for (const child of this.children) {
      child.dfs(action);
    }
    action(this);
  }

  /**
   *
   * @returns whether or not the node is a leaf
   */
  isLeaf() {
    return this.children.length === 0;
  }
}
