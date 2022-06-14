import { RNG } from "src/Libraries/Random";
import * as P from "parsimmon";
import * as PExtra from "src/Libraries/ParsimmonExtra";

////////////////////////////////////////////////////////////////////////////////
// Types
////////////////////////////////////////////////////////////////////////////////
export interface Strategy {
  readonly kind: Kind;
  run: (prng: RNG) => Tactic;
}

export type Tactic = (currentDepth: number) => {
  result: boolean;
  callBack: (currentDepth: number) => Tactic;
};

export namespace Kind {
  export type Depth = "Max Depth";
  export const Max: Depth = "Max Depth";
  export type Flip = "Flip Depth";
  export const Flip: Flip = "Flip Depth";
  export type Inherited = "Inherited Depth";
  export const Inherited: Inherited = "Inherited Depth";
}

export type Kind = Kind.Depth | Kind.Flip | Kind.Inherited;

////////////////////////////////////////////////////////////////////////////////
// Strategies
////////////////////////////////////////////////////////////////////////////////
export class MaxDepthStrategy implements Strategy {
  kind = Kind.Max;
  readonly maxDepth: number;

  update(maxDepth: number): MaxDepthStrategy {
    return new MaxDepthStrategy(maxDepth);
  }

  constructor(maxDepth: number) {
    this.maxDepth = maxDepth;
  }

  run(prng: RNG): Tactic {
    return max_depth(this.maxDepth);
  }
}

export class FlipDepthStrategy implements Strategy {
  kind = Kind.Flip;
  readonly maxDepth: number;
  readonly p: number;

  constructor(p: number, maxDepth: number) {
    this.maxDepth = maxDepth;
    this.p = p;
  }

  run(prng: RNG): Tactic {
    return coin_flip_depth(prng, this.p, this.maxDepth);
  }

  update(p?: number, maxDepth?: number): FlipDepthStrategy {
    return new FlipDepthStrategy(p || this.p, maxDepth || this.maxDepth);
  }
}

export class InheritedDepthStrategy implements Strategy {
  kind = Kind.Inherited;
  readonly minDepth: number;

  update(minDepth: number): MaxDepthStrategy {
    return new MaxDepthStrategy(minDepth);
  }

  constructor(minDepth: number) {
    this.minDepth = minDepth;
  }

  run(prng: RNG): Tactic {
    return inherited_depth(prng, this.minDepth);
  }
}

////////////////////////////////////////////////////////////////////////////////
// Provers
////////////////////////////////////////////////////////////////////////////////

export function isFlipDepthStrategy(
  strategy: Strategy
): strategy is FlipDepthStrategy {
  return strategy.kind === Kind.Flip;
}
export function isMaxDepthStrategy(
  strategy: Strategy
): strategy is MaxDepthStrategy {
  return strategy.kind === Kind.Max;
}

export function isInheritedDepthStrategy(
  strategy: Strategy
): strategy is InheritedDepthStrategy {
  return strategy.kind === Kind.Inherited;
}

////////////////////////////////////////////////////////////////////////////////
// Encode
////////////////////////////////////////////////////////////////////////////////

/**
 * This encoding must be as small as possible so we can store it in the URL
 *
 * Encode a Depth.Strategy value
 */
export const encode = (strat: Strategy) => {
  if (isMaxDepthStrategy(strat)) {
    return `M${strat.maxDepth}`;
  } else if (isFlipDepthStrategy(strat)) {
    return `F${strat.maxDepth}:${strat.p}`;
  } else {
    const s = strat as InheritedDepthStrategy;
    return `I${s.minDepth}`;
  }
};

const mDecoder: P.Parser<MaxDepthStrategy> = P.seqMap(
  P.string("M"),
  PExtra.floating,
  (_d, maxDepth) => new MaxDepthStrategy(maxDepth)
);

const fDecoder: P.Parser<FlipDepthStrategy> = P.seqMap(
  P.string("F"),
  PExtra.floating,
  P.string(":"),
  PExtra.floating,
  (_d, maxDepth, _s, p) => new FlipDepthStrategy(p, maxDepth)
);

const iDecoder: P.Parser<InheritedDepthStrategy> = P.seqMap(
  P.string("I"),
  PExtra.floating,
  (_d, minDepth) => new InheritedDepthStrategy(minDepth)
);

/**
 * This encoding must be as small as possible so we can store it in the URL
 *
 * Decode a Depth.Strategy value
 */
export const decode: P.Parser<Strategy> = P.alt(mDecoder, fDecoder, iDecoder);

////////////////////////////////////////////////////////////////////////////////
// Core
////////////////////////////////////////////////////////////////////////////////

export function generate(rng: RNG): Strategy {
  let m_depth = rng.uniformInteger(7, 12);

  let p = rng.truncated_gaussian(0.1, 0.2, 0, 0.2);
  let depth2 = rng.uniformInteger(5, 9);

  let depth3 = rng.uniformInteger(3, 5);
  return rng.pickUniform<Strategy>([
    new MaxDepthStrategy(m_depth),
    new FlipDepthStrategy(p, depth2),
    new InheritedDepthStrategy(depth3),
  ]);
}

////////////////////////////////////////////////////////////////////////////////
// Impl
////////////////////////////////////////////////////////////////////////////////

/**
 * The simplest strategy: True until you reach the max allowed depth.
 *
 * @param {number} depth the maximum depth allowed
 */
function max_depth(depth: number): Tactic {
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
function coin_flip_depth(rng: RNG, p: number, max_depth: number): Tactic {
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
function inherited_depth(rng: RNG, min_depth: number): Tactic {
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
