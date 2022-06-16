import { RNG } from "src/Libraries/Random";
import * as CN from "src/Libraries/ConstrainedNumber";

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
// Constraints
////////////////////////////////////////////////////////////////////////////////

export namespace Constraints {
  export namespace MaxDepth {
    export const maxDepthConstraint: CN.Constraint<1, 1, 12> = {
      step: 1,
      min: 1,
      max: 12,
    };
    export type MaxDepth = CN.ConstrainedNumber<1, 1, 12>;
    export const mkMaxDepth = CN.fromNumber(maxDepthConstraint);
  }
  export namespace FlipDepth {
    export const maxDepthConstraint: CN.Constraint<1, 1, 7> = {
      step: 1,
      min: 1,
      max: 7,
    };
    export type MaxDepth = CN.ConstrainedNumber<1, 1, 7>;
    export const mkMaxDepth = CN.fromNumber(maxDepthConstraint);

    export const pConstraint: CN.Constraint<0.01, 0, 1> = {
      step: 0.01,
      min: 0,
      max: 1,
    };
    export type P = CN.ConstrainedNumber<0.01, 0, 1>;
    export const mkP = CN.fromNumber(pConstraint);
  }

  export namespace InheritedDepth {
    export const minDepthConstraint: CN.Constraint<1, 1, 4> = {
      step: 1,
      min: 1,
      max: 4,
    };
    export type MinDepth = CN.ConstrainedNumber<1, 1, 4>;
    export const mkMinDepth = CN.fromNumber(minDepthConstraint);
  }
}

////////////////////////////////////////////////////////////////////////////////
// Strategies
////////////////////////////////////////////////////////////////////////////////
export class MaxDepthStrategy implements Strategy {
  kind = Kind.Max;
  readonly maxDepth: Constraints.MaxDepth.MaxDepth;

  update(maxDepth: Constraints.MaxDepth.MaxDepth): MaxDepthStrategy {
    return new MaxDepthStrategy(maxDepth);
  }

  constructor(maxDepth: Constraints.MaxDepth.MaxDepth) {
    this.maxDepth = maxDepth;
  }

  run(prng: RNG): Tactic {
    return max_depth(this.maxDepth.value);
  }
}

export class FlipDepthStrategy implements Strategy {
  kind = Kind.Flip;
  readonly maxDepth: Constraints.FlipDepth.MaxDepth;
  readonly p: Constraints.FlipDepth.P;

  constructor(
    p: Constraints.FlipDepth.P,
    maxDepth: Constraints.FlipDepth.MaxDepth
  ) {
    this.maxDepth = maxDepth;
    this.p = p;
  }

  run(prng: RNG): Tactic {
    return coin_flip_depth(prng, this.p.value, this.maxDepth.value);
  }

  update(
    p?: Constraints.FlipDepth.P,
    maxDepth?: Constraints.FlipDepth.MaxDepth
  ): FlipDepthStrategy {
    return new FlipDepthStrategy(p || this.p, maxDepth || this.maxDepth);
  }
}

export class InheritedDepthStrategy implements Strategy {
  kind = Kind.Inherited;
  readonly minDepth: Constraints.InheritedDepth.MinDepth;

  update(
    minDepth: Constraints.InheritedDepth.MinDepth
  ): InheritedDepthStrategy {
    return new InheritedDepthStrategy(minDepth);
  }

  constructor(minDepth: Constraints.InheritedDepth.MinDepth) {
    this.minDepth = minDepth;
  }

  run(prng: RNG): Tactic {
    return inherited_depth(prng, this.minDepth.value);
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
// Core
////////////////////////////////////////////////////////////////////////////////

export function generate(rng: RNG): Strategy {
  let m_depth = rng.uniformInteger(7, 12);

  let p = rng.truncated_gaussian(0.1, 0.2, 0, 0.2);
  let depth2 = rng.uniformInteger(5, 9);

  let depth3 = rng.uniformInteger(3, 5);
  return rng.pickUniform<Strategy>([
    new MaxDepthStrategy(Constraints.MaxDepth.mkMaxDepth(m_depth)),
    new FlipDepthStrategy(
      Constraints.FlipDepth.mkP(p),
      Constraints.FlipDepth.mkMaxDepth(depth2)
    ),
    new InheritedDepthStrategy(Constraints.InheritedDepth.mkMinDepth(depth3)),
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
