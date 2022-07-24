import * as CN from "src/Libraries/ConstrainedNumber";
import * as P5Extra from "src/Libraries/P5Extra/Palette";
import { RNG } from "src/Libraries/Random";
import { uniform1f, uniform2f, uniform3f } from "src/Libraries/WebGL/uniform";
import * as UrlEncode from "src/Libraries/UrlEncode";
export namespace Constraints {
  export namespace Cosine {
    export type params = { step: 0.1; min: 0; max: 20 };
    export const params: params = { step: 0.1, min: 0, max: 20 };
    export type CN = CN.ConstrainedNumber<
      params["step"],
      params["min"],
      params["max"]
    >;
    export const make: (n: number) => CN = CN.fromNumber(params);
  }
  export namespace Noise {
    export type params = { step: 0.01; min: 0.7; max: 1.3 };
    export const params: params = { step: 0.01, min: 0.7, max: 1.3 };
    export type CN = CN.ConstrainedNumber<
      params["step"],
      params["min"],
      params["max"]
    >;
    export const make: (n: number) => CN = CN.fromNumber(params);
  }
  export namespace Displace {
    export type params = { step: 0.1; min: 0; max: 20 };
    export const params: params = { step: 0.1, min: 0, max: 20 };
    export type CN = CN.ConstrainedNumber<
      params["step"],
      params["min"],
      params["max"]
    >;
    export const make: (n: number) => CN = CN.fromNumber(params);
  }

  export namespace Coordinate {
    export type params = { step: 0.01; min: 0; max: 1 };
    export const params: params = { step: 0.01, min: 0, max: 1 };
    export type CN = CN.ConstrainedNumber<
      params["step"],
      params["min"],
      params["max"]
    >;
    export const make: (n: number) => CN = CN.fromNumber(params);
  }
}

export type Settings = {
  zoom: CN.ConstrainedNumber<0.1, 0.4, 1.6>;

  // Color
  cosineC: [
    Constraints.Cosine.CN,
    Constraints.Cosine.CN,
    Constraints.Cosine.CN
  ];
  cosineD: [
    Constraints.Cosine.CN,
    Constraints.Cosine.CN,
    Constraints.Cosine.CN
  ];
  colorSpeed: CN.ConstrainedNumber<0.1, 0.5, 1.0>;

  // Noise Params
  numOctaves: CN.ConstrainedNumber<1, 8, 16>;
  q: [Constraints.Noise.CN, Constraints.Noise.CN];
  r: [Constraints.Noise.CN, Constraints.Noise.CN];
  pattern: CN.ConstrainedNumber<0.01, 0.8, 1.2>;

  // This create variations of the same art work. Not super intersting
  qDisplaceX: [Constraints.Displace.CN, Constraints.Displace.CN];
  qDisplaceY: [Constraints.Displace.CN, Constraints.Displace.CN];
  rDisplaceX: [Constraints.Displace.CN, Constraints.Displace.CN];
  rDisplaceY: [Constraints.Displace.CN, Constraints.Displace.CN];

  // Strategies
  pixelDistanceStrategy: PixelDistance.Strategy;
  interpolationStrategy: 1 | 2 | 3;
  centerPoint: [Constraints.Coordinate.CN, Constraints.Coordinate.CN];
};

export namespace PixelDistance {
  export const all: Strategy[] = [1, 2, 3, 4, 5, 6, 7, 8];
  export type Strategy = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  export type StrategyKind = string;

  export function toKind(strategy: Strategy): StrategyKind {
    switch (strategy) {
      case 1:
        return "X-Axis";
      case 2:
        return "Y-Axis";
      case 3:
        return "Circular";
      case 4:
        return "Manhattan Distance";
      case 5:
        return "Dot Product - Simple";
      case 6:
        return "Dot Product - Normalized - 1";
      case 7:
        return "Dot Product - Normalized - 2";
      case 8:
        return "Noise Value";
    }
  }

  export function hasCenterPoint(strategy: Strategy): boolean {
    return strategy === 3 || strategy === 4;
  }
}

export namespace Interpolation {
  export const all: Strategy[] = [1, 2, 3];
  export type Strategy = 1 | 2 | 3;
  export type StrategyKind = string;
  export function toKind(strategy: Strategy): StrategyKind {
    switch (strategy) {
      case 1:
        return "Linear";
      case 2:
        return "Cubic";
      case 3:
        return "Super Smooth";
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////

const vSchema = UrlEncode.VObject({
  zoom: UrlEncode.VConstrainedNumber({ step: 0.1, min: 0.4, max: 1.6 }),

  // Color
  cosineC: UrlEncode.VArray(
    UrlEncode.VConstrainedNumber(Constraints.Cosine.params)
  ),
  cosineD: UrlEncode.VArray(
    UrlEncode.VConstrainedNumber(Constraints.Cosine.params)
  ),
  colorSpeed: UrlEncode.VConstrainedNumber({ step: 0.1, min: 0.5, max: 1.0 }),

  // Noise Params
  numOctaves: UrlEncode.VConstrainedNumber({ step: 1, min: 8, max: 16 }),
  q: UrlEncode.VArray(UrlEncode.VConstrainedNumber(Constraints.Noise.params)),
  r: UrlEncode.VArray(UrlEncode.VConstrainedNumber(Constraints.Noise.params)),
  pattern: UrlEncode.VConstrainedNumber({ step: 0.01, min: 0.8, max: 1.2 }),
  qDisplaceX: UrlEncode.VArray(
    UrlEncode.VConstrainedNumber(Constraints.Displace.params)
  ),
  qDisplaceY: UrlEncode.VArray(
    UrlEncode.VConstrainedNumber(Constraints.Displace.params)
  ),
  rDisplaceX: UrlEncode.VArray(
    UrlEncode.VConstrainedNumber(Constraints.Displace.params)
  ),
  rDisplaceY: UrlEncode.VArray(
    UrlEncode.VConstrainedNumber(Constraints.Displace.params)
  ),

  // Strategies
  pixelDistanceStrategy: UrlEncode.VNumber,
  interpolationStrategy: UrlEncode.VNumber,
  centerPoint: UrlEncode.VArray(
    UrlEncode.VConstrainedNumber(Constraints.Coordinate.params)
  ),
});

export namespace URL {
  const pairEnDecode = UrlEncode.construct(vSchema);

  export const encode: (value: Settings) => string = pairEnDecode.encode;
  export const decode = pairEnDecode.decode as (s: string) => Promise<Settings>;
}

////////////////////////////////////////////////////////////////////////////////
// RNG
////////////////////////////////////////////////////////////////////////////////

export function random(rng: RNG): Settings {
  return {
    zoom: CN.fromNumber({ step: 0.1, min: 0.4, max: 1.6 })(
      rng.uniform(0.4, 1.6)
    ),

    // Color
    cosineC: [
      Constraints.Cosine.make(rng.uniform(10, 20)),
      Constraints.Cosine.make(rng.uniform(10, 20)),
      Constraints.Cosine.make(rng.uniform(10, 20)),
    ],
    cosineD: [
      Constraints.Cosine.make(rng.uniform(10, 20)),
      Constraints.Cosine.make(rng.uniform(10, 20)),
      Constraints.Cosine.make(rng.uniform(10, 20)),
    ],
    colorSpeed: CN.fromNumber({ step: 0.1, min: 0.5, max: 1.0 })(
      rng.uniform(0.5, 1.0)
    ),

    // Noise Params
    numOctaves: CN.fromNumber({ step: 1, min: 8, max: 16 })(
      rng.pickUniform([8, 9, 10, 11, 12, 13, 14, 15, 16])
    ),
    q: [
      Constraints.Noise.make(rng.uniform(0.7, 1.3)),
      Constraints.Noise.make(rng.uniform(0.7, 1.3)),
    ],
    r: [
      Constraints.Noise.make(rng.uniform(0.7, 1.3)),
      Constraints.Noise.make(rng.uniform(0.7, 1.3)),
    ],
    pattern: CN.fromNumber({ step: 0.01, min: 0.8, max: 1.2 })(
      rng.uniform(0.8, 1.2)
    ),
    qDisplaceX: [
      Constraints.Displace.make(rng.uniform(0, 20)),
      Constraints.Displace.make(rng.uniform(0, 20)),
    ],
    qDisplaceY: [
      Constraints.Displace.make(rng.uniform(0, 20)),
      Constraints.Displace.make(rng.uniform(0, 20)),
    ],
    rDisplaceX: [
      Constraints.Displace.make(rng.uniform(0, 20)),
      Constraints.Displace.make(rng.uniform(0, 20)),
    ],
    rDisplaceY: [
      Constraints.Displace.make(rng.uniform(0, 20)),
      Constraints.Displace.make(rng.uniform(0, 20)),
    ],

    // Strategies
    pixelDistanceStrategy: rng.pickUniform([1, 2, 3, 4, 5, 6, 7, 8]),
    interpolationStrategy: rng.pickUniform([1, 2, 3]),
    centerPoint: [
      Constraints.Coordinate.make(rng.random()),
      Constraints.Coordinate.make(rng.random()),
    ],
  };
}

export const setUniforms =
  (gl: WebGL2RenderingContext) =>
  (program: WebGLProgram) =>
  (settings: Settings): void => {
    const u1f = uniform1f(gl)(program);
    const u2f = uniform2f(gl)(program);
    const u3f = uniform3f(gl)(program);
    u1f("u_numOctaves", settings.numOctaves.value);
    u1f("u_zoom", settings.zoom.value);
    u3f(
      "u_cc",
      settings.cosineC[0].value,
      settings.cosineC[1].value,
      settings.cosineC[2].value
    );
    u3f(
      "u_dd",
      settings.cosineD[0].value,
      settings.cosineD[1].value,
      settings.cosineD[2].value
    );
    u2f("u_q_h", settings.q[0].value, settings.q[1].value);
    u2f("u_r_h", settings.r[0].value, settings.r[1].value);
    u1f("u_pattern_h", settings.pattern.value);
    u2f(
      "u_center_point",
      settings.centerPoint[0].value,
      settings.centerPoint[1].value
    );
    u1f("u_pixel_distance_choice", settings.pixelDistanceStrategy); // Needs fix
    u1f("u_interpolation_choice", settings.interpolationStrategy); // Needs fix
    u2f(
      "u_q_fbm_displace_1",
      settings.qDisplaceX[0].value,
      settings.qDisplaceX[1].value
    );
    u2f(
      "u_q_fbm_displace_2",
      settings.qDisplaceY[0].value,
      settings.qDisplaceY[1].value
    );
    u2f(
      "u_r_fbm_displace_1",
      settings.rDisplaceX[0].value,
      settings.rDisplaceX[1].value
    );
    u2f(
      "u_r_fbm_displace_2",
      settings.rDisplaceY[0].value,
      settings.rDisplaceY[1].value
    );
    u1f("u_color_speed", settings.colorSpeed.value);
  };
