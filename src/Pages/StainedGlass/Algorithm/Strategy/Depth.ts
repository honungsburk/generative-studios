import { RNG } from "src/Libraries/Random";

export type DepthStrategyFn = (currentDepth: number) => {
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

export const getDepthStrategyFn = (rng: RNG, strat: DepthStrategy) => {
  switch (strat.kind) {
    case "Max Depth":
      return max_depth(strat.maxDepth);
    case "Flip Depth":
      return coin_flip_depth(rng, strat.p, strat.depth);
    case "Inherited Depth":
      return inherited_depth(rng, strat.depth);
  }
};

export function generateDepthStrategy(rng: RNG): DepthStrategy {
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
