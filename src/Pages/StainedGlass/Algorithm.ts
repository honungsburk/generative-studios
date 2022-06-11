import { RNG } from "../../Libraries/Random";
import Point2D from "./Point2D";
import Triangle from "./Triangle";
import p5Types from "p5";
import * as Palette from "../../Libraries/P5Extra/Palette";
import * as ArtLink from "src/Libraries/ArtLink";

// P5.js Hooks

/**
 *
 * @returns a seed to be used to create the artwork
 */
export function generateSeed(): string {
  return Math.random().toString().substr(2, 8);
}

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

export type SplitStrategyFn = (triangle: Triangle) => [Triangle, Triangle];

export const SPLITRANDOM: SplitStrategy = "Split Random";
export const SPLITRANDOMBALANCED: SplitStrategy = "Split Random Balanced";
export const SPLITMIDDLE: SplitStrategy = "Split Middle";

export type SplitStrategy =
  | "Split Random"
  | "Split Random Balanced"
  | "Split Middle";

export function getSplitStratFn(
  rng: RNG,
  strat: SplitStrategy
): SplitStrategyFn {
  switch (strat) {
    case "Split Random":
      return split_random(rng);
    case "Split Random Balanced":
      return split_random_balanced(rng);
    case "Split Middle":
      return split_middle;
  }
}

export function generateSplitStrat(rng: RNG): SplitStrategy {
  return rng.pickFromWeightedList([
    { weight: 1, value: "Split Random" },
    { weight: 2, value: "Split Random Balanced" },
    { weight: 1, value: "Split Random Balanced" },
  ]);
}

/**
 *
 * This splitting strategy is responsible for making the symmetric splitting.
 *
 * @param {json} triangle
 */
const split_middle: SplitStrategyFn = (triangle) => {
  //find the longest side
  let origin = new Point2D(0, 0);
  let lab = triangle.a.minus(triangle.b).distance_to(origin);
  let lac = triangle.a.minus(triangle.c).distance_to(origin);
  let lbc = triangle.b.minus(triangle.c).distance_to(origin);

  if (lab > lac && lab > lbc) {
    let d = triangle.a.add(triangle.b).scale(0.5);
    return [
      new Triangle(triangle.c, triangle.a, d),
      new Triangle(triangle.c, triangle.b, d),
    ];
  }

  if (lac > lab && lac > lbc) {
    let d = triangle.a.add(triangle.c).scale(0.5);
    return [
      new Triangle(triangle.b, triangle.a, d),
      new Triangle(triangle.b, triangle.c, d),
    ];
  }

  let d = triangle.b.add(triangle.c).scale(0.5);
  //find the middle point on the other side
  return [
    new Triangle(triangle.a, triangle.b, d),
    new Triangle(triangle.a, triangle.c, d),
  ];
};

/**
 * This splitting strategy created the more 'spiky' images.
 *
 * @param {RNG} rng
 * @returns
 */
const split_random: (rng: RNG) => SplitStrategyFn = (rng) => (triangle) => {
  let cut = rng.truncated_gaussian(0.5, 1, 0.1, 0.9);
  let choice = rng.random();
  if (choice < 1 / 3) {
    let d = triangle.a.minus(triangle.b).scale(cut).add(triangle.b);
    return [
      new Triangle(triangle.c, triangle.a, d),
      new Triangle(triangle.c, triangle.b, d),
    ];
  }

  if (choice < 2 / 3) {
    let d = triangle.a.minus(triangle.c).scale(cut).add(triangle.c);
    return [
      new Triangle(triangle.b, triangle.a, d),
      new Triangle(triangle.b, triangle.c, d),
    ];
  }

  let d = triangle.b.minus(triangle.c).scale(cut).add(triangle.c);
  //find the middle point on the other side
  return [
    new Triangle(triangle.a, triangle.b, d),
    new Triangle(triangle.a, triangle.c, d),
  ];
};

/**
 * This splitting strategy creates the randomly split triangles, but not
 * the spiky ones.
 *
 * @param {RNG} rng
 * @returns
 */
const split_random_balanced: (rng: RNG) => SplitStrategyFn =
  (rng) => (triangle) => {
    let cut = rng.truncated_gaussian(0.5, 1, 0.1, 0.9);
    //find the longest side
    let origin = new Point2D(0, 0);
    let lab = triangle.a.minus(triangle.b).distance_to(origin);
    let lac = triangle.a.minus(triangle.c).distance_to(origin);
    let lbc = triangle.b.minus(triangle.c).distance_to(origin);

    if (lab > lac && lab > lbc) {
      let d = triangle.a.minus(triangle.b).scale(cut).add(triangle.b);
      return [
        new Triangle(triangle.c, triangle.a, d),
        new Triangle(triangle.c, triangle.b, d),
      ];
    }

    if (lac > lab && lac > lbc) {
      let d = triangle.a.minus(triangle.c).scale(cut).add(triangle.c);
      return [
        new Triangle(triangle.b, triangle.a, d),
        new Triangle(triangle.b, triangle.c, d),
      ];
    }
    let d = triangle.b.minus(triangle.c).scale(cut).add(triangle.c);
    //find the middle point on the other side
    return [
      new Triangle(triangle.a, triangle.b, d),
      new Triangle(triangle.a, triangle.c, d),
    ];
  };

////// Stroke Color //////

const make_strokeColor: (
  rng: RNG
) => (color: p5Types.Color) => p5Types.Color = (rng: RNG) => {
  // Since I put a one here it is practically disabled
  // I simply didn't think it looked good.
  return (color) => color;
};

////// Depth //////

type DepthStrategyFn = (currentDepth: number) => {
  result: boolean;
  callBack: (currentDepth: number) => DepthStrategyFn;
};

export type DepthStrategy =
  | MaxDepthStrategy
  | FlipDepthStrategy
  | InheritedDepthStrategy;
export type MaxDepthStrategy = {
  kind: "Max Depth";
  maxDepth: number;
};

export function MaxDepthStrategy(maxDepth: number): MaxDepthStrategy {
  return {
    kind: "Max Depth",
    maxDepth: maxDepth,
  };
}

export type FlipDepthStrategy = {
  kind: "Flip Depth";
  p: number;
  depth: number;
};

export function FlipDepthStrategy(p: number, depth: number): FlipDepthStrategy {
  return {
    kind: "Flip Depth",
    p: p,
    depth: depth,
  };
}

export type InheritedDepthStrategy = {
  kind: "Inherited Depth";
  depth: number;
};

export function InheritedDepthStrategy(depth: number): InheritedDepthStrategy {
  return {
    kind: "Inherited Depth",
    depth: depth,
  };
}

export const getDepthStrategy = (
  strat: "Max Depth" | "Flip Depth" | "Inherited Depth"
) => {
  switch (strat) {
    case "Max Depth":
      return MaxDepthStrategy(10);
    case "Flip Depth":
      return FlipDepthStrategy(0.01, 6);
    case "Inherited Depth":
      return InheritedDepthStrategy(4);
  }
};

const getDepthStrategyFn = (rng: RNG, strat: DepthStrategy) => {
  switch (strat.kind) {
    case "Max Depth":
      return max_depth(strat.maxDepth);
    case "Flip Depth":
      return coin_flip_depth(rng, strat.p, strat.depth);
    case "Inherited Depth":
      return inherited_depth(rng, strat.depth);
  }
};

function generateDepthStrategy(rng: RNG): DepthStrategy {
  let m_depth = rng.uniformInteger(7, 12);

  let p = rng.truncated_gaussian(0.1, 0.2, 0, 0.2);
  let depth2 = rng.uniformInteger(5, 9);

  let depth3 = rng.uniformInteger(3, 5);

  return rng.pickUniform<DepthStrategy>([
    {
      kind: "Max Depth",
      maxDepth: m_depth,
    },
    {
      kind: "Flip Depth",
      p: p,
      depth: depth2,
    },
    {
      kind: "Inherited Depth",
      depth: depth3,
    },
  ]);
}

/**
 * The simplest strategy: True until you reach the max allowed depth.
 *
 * @param {number} depth the maximum depth allowed
 */
function max_depth(depth: number): DepthStrategyFn {
  let f = (current_depth: number) => {
    return { result: current_depth <= depth, callBack: f };
  };
  return f as any;
}

/**
 * Has a maximum depth and then each triangle has a probability of going beyond that
 * Of course this will create two new triangles that also get that probability...
 *
 * @param {RNG} rng the random number generator
 * @param {number} p the probability of going one step deeper
 * @param {*} max_depth the max depth
 * @returns
 */
function coin_flip_depth(
  rng: RNG,
  p: number,
  max_depth: number
): DepthStrategyFn {
  let f = function (current_depth: number) {
    return {
      result: current_depth <= max_depth || rng.bernoulli(p),
      callBack: f,
    };
  };

  return f as any;
}

/**
 * Starts with a minimum depth and then in each first call randomly extend that
 * minimum depth.
 *
 * @param {RNG} rng the random number generator
 * @param {number} min_depth the minimum depth
 * @returns
 */
function inherited_depth(rng: RNG, min_depth: number): DepthStrategyFn {
  let f = function (current_depth: number) {
    if (min_depth <= current_depth) {
      let max_depth = rng.binomial(11, 0.6) + min_depth;

      let cb = function (current_depth_2: number) {
        return { result: current_depth_2 <= max_depth, callBack: cb };
      };

      return { result: current_depth <= max_depth, callBack: cb };
    } else {
      return { result: true, callBack: f };
    }
  };

  return f as any;
}

////// Draw //////

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
  // strokeColor: (color: p5Types.Color) => p5Types.Color,
  // strokeW: number
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

////// Palette //////

/**
 *
 * @param {RNG} rng a random number generator
 * @returns a cosine palette taking in a number and spitting out a color
 */
function generatePalette(rng: RNG): Palette.CosinePalette {
  let levels = [0, 1 / 5, 2 / 5, 3 / 5, 4 / 5, 1];
  let b_picks = [1 / 4, 1 / 2, 3 / 4];
  let c_picks = [2 / 5, 3 / 5, 4 / 5, 1];
  return {
    red: {
      a: rng.pickUniform(levels),
      b:
        rng.pickUniform(b_picks) +
        rng.truncated_gaussian(0.125, 0.5, 0.05, 0.2),
      c: rng.pickUniform(c_picks),
      d: rng.pickUniform(levels),
    },
    green: {
      a: rng.pickUniform(levels),
      b:
        rng.pickUniform(b_picks) +
        rng.truncated_gaussian(0.125, 0.5, 0.05, 0.2),
      c: rng.pickUniform(c_picks),
      d: rng.pickUniform(levels),
    },
    blue: {
      a: rng.pickUniform(levels),
      b:
        rng.pickUniform(b_picks) +
        rng.truncated_gaussian(0.125, 0.5, 0.05, 0.2),
      c: rng.pickUniform(c_picks),
      d: rng.pickUniform(levels),
    },
    mode: rng.pickFromWeightedList<Palette.ConsineMode>([
      { weight: 9, value: "SMOOTH" },
      { weight: 1, value: "MOD" },
    ]),
  };
}

////// Jitter //////

type JitterFn = (val: number) => number;

/**
 *
 * By adding some randomness when assigning colors to the triangles some very
 * nice and pleasing effects can be achieved.
 *
 * @param {RNG} rng the random number generator to use
 * @param {number} magnitude number between 0-1
 * @returns a function that jitters its inputs
 */
function genJitterFn(rng: RNG, magnitude: number): JitterFn {
  return function (val: number) {
    let lower = val - magnitude;
    if (lower < 0) {
      lower = 0;
    }
    let upper = val + magnitude;
    if (upper > 1) {
      upper = 1;
    }
    let out = rng.uniform(lower, upper);
    return out;
  };
}

////// Triangle Distance Metric //////

type DistanceStrategyFn = (triangle: Triangle) => number;

export const XCentroid: DistanceStrategy = { kind: "X Centroid" };
export const YCentroid: DistanceStrategy = { kind: "Y Centroid" };
export const DistToPoint: (x: number, y: number) => DistanceStrategy = (
  x,
  y
) => {
  return { kind: "Dist to Point", x: x, y: y };
};

export function getDistanceStrategy(
  kind: "X Centroid" | "Y Centroid" | "Dist to Point"
): DistanceStrategy {
  switch (kind) {
    case "X Centroid":
      return XCentroid;
    case "Y Centroid":
      return YCentroid;
    case "Dist to Point":
      return DistToPoint(Math.random(), Math.random());
  }
}

export type DistanceStrategy =
  | XCentroidStrategy
  | YCentroidStrategy
  | DistanceToPointStrategy;
export type XCentroidStrategy = { kind: "X Centroid" };
export type YCentroidStrategy = { kind: "Y Centroid" };
export type DistanceToPointStrategy = {
  kind: "Dist to Point";
  x: number;
  y: number;
};

function getDistStrategyFn(strat: DistanceStrategy): DistanceStrategyFn {
  switch (strat.kind) {
    case "X Centroid":
      return x_centroid;
    case "Y Centroid":
      return y_centroid;
    case "Dist to Point":
      return dist_to_centroid(new Point2D(strat.x, strat.y));
  }
}

function generateDistStrategy(rng: RNG): DistanceStrategy {
  return rng.pickUniform([
    XCentroid,
    YCentroid,
    DistToPoint(rng.random(), rng.random()),
    DistToPoint(0.5, 0.5),
  ]);
}

/**
 *
 * @param {triangle} triangle
 * @returns returns the x coordinate of the triangle's centroid
 */
const x_centroid: DistanceStrategyFn = (triangle) => {
  return triangle.center().x;
};

/**
 *
 * @param {triangle} triangle
 * @returns returns the y coordinate of the triangle's centroid
 */
const y_centroid: DistanceStrategyFn = (triangle) => {
  return triangle.center().y;
};

/**
 *
 * @param {Point} other
 * @returns a function that calculates the euclidean distance between a triangle
 * and the given Point.
 */
const dist_to_centroid: (other: Point2D) => DistanceStrategyFn =
  (other) => (triangle) => {
    return triangle.center().distance_to(other);
  };

const dist_to_middle: DistanceStrategyFn = dist_to_centroid(
  new Point2D(0.5, 0.5)
);

/**
 *
 * @param {RNG} rng
 * @returns the euclidean distance of a triangle's centroid to a random point.
 */
const dist_to_random: (rng: RNG) => DistanceStrategyFn = (rng) => {
  let rndPoint = new Point2D(rng.random(), rng.random());
  return dist_to_centroid(rndPoint);
};

////// SmartTree //////

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
