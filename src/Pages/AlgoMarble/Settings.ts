import * as CN from "src/Libraries/ConstrainedNumber";
import * as P5Extra from "src/Libraries/P5Extra/Palette";
import { RNG } from "src/Libraries/Random";
import { uniform1f, uniform2f, uniform3f } from "src/Libraries/WebGL/uniform";

export namespace Constraints {
  export type Cosine = CN.ConstrainedNumber<0.1, 0, 20>;
  export const makeCosine: (n: number) => Cosine = CN.fromNumber({
    step: 0.1,
    min: 0,
    max: 20,
  });
  export type Noise = CN.ConstrainedNumber<0.01, 0.7, 1.3>;
  export const makeNoise: (n: number) => Noise = CN.fromNumber({
    step: 0.01,
    min: 0.7,
    max: 1.3,
  });
  export type Displace = CN.ConstrainedNumber<0.1, 0, 20>;
  export const makeDisplace: (n: number) => Displace = CN.fromNumber({
    step: 0.1,
    min: 0,
    max: 20,
  });
  export type Coordinate = CN.ConstrainedNumber<0.01, 0, 1>;
  export const makeCoordinate: (n: number) => Coordinate = CN.fromNumber({
    step: 0.01,
    min: 0,
    max: 1,
  });
}

export type Settings = {
  zoom: CN.ConstrainedNumber<0.1, 0.4, 1.6>;

  // Color
  cosineC: [Constraints.Cosine, Constraints.Cosine, Constraints.Cosine];
  cosineD: [Constraints.Cosine, Constraints.Cosine, Constraints.Cosine];
  colorSpeed: CN.ConstrainedNumber<0.1, 0.5, 1.0>;

  // Noise Params
  numOctaves: 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
  q: [Constraints.Noise, Constraints.Noise];
  r: [Constraints.Noise, Constraints.Noise];
  pattern: CN.ConstrainedNumber<0.01, 0.8, 1.2>;
  qDisplaceX: [Constraints.Displace, Constraints.Displace];
  qDisplaceY: [Constraints.Displace, Constraints.Displace];
  rDisplaceX: [Constraints.Displace, Constraints.Displace];
  rDisplaceY: [Constraints.Displace, Constraints.Displace];

  // Strategies
  pixelDistanceStrategy: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  interpolationStrategy: 1 | 2 | 3;
  centerPoint: [Constraints.Coordinate, Constraints.Coordinate];
};

export function random(rng: RNG): Settings {
  return {
    zoom: CN.fromNumber({ step: 0.1, min: 0.4, max: 1.6 })(rng.uniform(8, 16)),

    // Color
    cosineC: [
      Constraints.makeCosine(rng.uniform(10, 20)),
      Constraints.makeCosine(rng.uniform(10, 20)),
      Constraints.makeCosine(rng.uniform(10, 20)),
    ],
    cosineD: [
      Constraints.makeCosine(rng.uniform(10, 20)),
      Constraints.makeCosine(rng.uniform(10, 20)),
      Constraints.makeCosine(rng.uniform(10, 20)),
    ],
    colorSpeed: CN.fromNumber({ step: 0.1, min: 0.5, max: 1.0 })(
      rng.uniform(0.5, 1.0)
    ),

    // Noise Params
    numOctaves: rng.pickUniform([8, 9, 10, 11, 12, 13, 14, 15, 16]),
    q: [
      Constraints.makeNoise(rng.uniform(0.7, 1.3)),
      Constraints.makeNoise(rng.uniform(0.7, 1.3)),
    ],
    r: [
      Constraints.makeNoise(rng.uniform(0.7, 1.3)),
      Constraints.makeNoise(rng.uniform(0.7, 1.3)),
    ],
    pattern: CN.fromNumber({ step: 0.01, min: 0.8, max: 1.2 })(
      rng.uniform(0.8, 1.2)
    ),
    qDisplaceX: [
      Constraints.makeDisplace(rng.uniform(0, 20)),
      Constraints.makeDisplace(rng.uniform(0, 20)),
    ],
    qDisplaceY: [
      Constraints.makeDisplace(rng.uniform(0, 20)),
      Constraints.makeDisplace(rng.uniform(0, 20)),
    ],
    rDisplaceX: [
      Constraints.makeDisplace(rng.uniform(0, 20)),
      Constraints.makeDisplace(rng.uniform(0, 20)),
    ],
    rDisplaceY: [
      Constraints.makeDisplace(rng.uniform(0, 20)),
      Constraints.makeDisplace(rng.uniform(0, 20)),
    ],

    // Strategies
    pixelDistanceStrategy: rng.pickUniform([1, 2, 3, 4, 5, 6, 7, 8]),
    interpolationStrategy: rng.pickUniform([1, 2, 3]),
    centerPoint: [
      Constraints.makeCoordinate(rng.random()),
      Constraints.makeCoordinate(rng.random()),
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
    u1f("u_numOctaves", settings.numOctaves);
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
