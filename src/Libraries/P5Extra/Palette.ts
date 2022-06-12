import p5Types from "p5";
import * as MathExtra from "../MathExtra";
/**
 * When doing color choices there are a few tips
 *
 * # Quick Tips
 *
 * ## Use HSV instead of RGB
 *
 * ## Experiment with the background color
 *
 * Black is a difficult background color, white or off-white is an easier
 * place to start at. But why not go for it and be more creative?
 *
 * ## No Random Colors
 *
 * ## Shapes of all sizes
 *
 * Provide large compositional elements and then add details. Does it need to be
 * just a square or should I try to give some texture to it? Why not make the strate
 * line out of dots?
 *
 * ## Experiment, Experiment, Experiment
 *
 * Even when you think you are done with your piece, go through all the variables
 * and change them, tweak them. Maybe even write a small program to iteratively go through
 * bunch of combos. You will find stuff. I promise.
 *
 * ## The image must stand on its own
 *
 * ## Curate
 *
 * # Colors
 *
 * ## Distribution
 *
 * Think of interesting probability distributions when sampling colors
 *
 * ## Gradients
 *
 * Start with one color in on are of the image, and transition to another.
 * Break it up with some randomness and you might get something really cool.
 *
 * ## Clumping
 *
 * Parts of the image which are near one another get similar color
 *
 * ## Sort
 *
 * You can sort the colors as bands, add some random sampling and nice!
 *
 * ## Sampling
 *
 * You can sample the colors from another image
 *
 * ## Inheritance
 *
 * If the parent is red then there is a high probability of the child also being
 * red.
 *
 * ## Compositional
 *
 * You can organize the random selecting of colors depending on some shape,
 * Maybe within some circle all the colors get brighter.
 *
 *
 *
 */

/**
 *
 * @param {number} H the hue a value between 0-360
 * @param {number} S the saturation 0-100
 * @param {number} V the value 0-100
 * @returns a list of three colors making a triad color scheme
 */
export const triad = (p5: p5Types) => (H: number, S: number, V: number) => {
  return [
    p5.color(H, S, V),
    p5.color(H + ((360 / 3) % 360), S, V),
    p5.color((H + (2 * 360) / 3) % 360, S, V),
  ] as [p5Types.Color, p5Types.Color, p5Types.Color];
};

/**
 *
 * @param {number} H the hue a value between 0-360
 * @param {number} S the saturation 0-100
 * @param {number} V the value 0-100
 * @returns a list of three colors making a analogous color scheme
 */
export const analogous = (p5: p5Types) => (H: number, S: number, V: number) => {
  return [
    p5.color(H, S, V),
    p5.color(H - 30 / 3, S, V),
    p5.color(H + 30, S, V),
  ] as [p5Types.Color, p5Types.Color, p5Types.Color];
};

/**
 *
 * @param {number} H the hue a value between 0-360
 * @param {number} S the saturation 0-100
 * @param {number} V the value 0-100
 * @returns a list of four colors making a tetrad color scheme
 */
export const tetrad = (p5: p5Types) => (H: number, S: number, V: number) => {
  let shift = 90;
  return [
    p5.color(H, S, V),
    p5.color(H - shift, S, V),
    p5.color(H + (shift % 360), S, V),
    p5.color(H + ((shift * 2) % 360), S, V),
  ] as [p5Types.Color, p5Types.Color, p5Types.Color, p5Types.Color];
};

/**
 *
 * @param {number} H the hue a value between 0-360
 * @param {number} S the saturation 0-100
 * @param {number} V the value 0-100
 * @returns a list of two colors making a complimentary color scheme
 */
export const complimentary =
  (p5: p5Types) => (H: number, S: number, V: number) => {
    return [p5.color(H, S, V), p5.color((H + 180) % 360, S, V)] as [
      p5Types.Color,
      p5Types.Color
    ];
  };

export type CosinePalette = {
  red: CosineColor;
  green: CosineColor;
  blue: CosineColor;
  mode: ConsineMode;
};

export type CosineColor = {
  a: number;
  b: number;
  c: number;
  d: number;
};

export type ConsineMode = "MOD" | "SMOOTH";

/**
 * {
 *      red: {a: 0.5, b: 0.5, c: 1, d: 0},
 *      green: {a: 0.5, b: 0.5, c: 1, d: 0.33},
 *      blue: {a: 0.5, b: 0.5, c: 1, d: 0.67},
 * }
 *
 * @param {json} param0
 * @param {string} mode can be either "MOD" or "SMOOTH"/undefined
 * @returns a function that is a continuous color palette
 */
export const cosine_palette =
  (p5: p5Types) =>
  (
    red: CosineColor,
    green: CosineColor,
    blue: CosineColor,
    mode: ConsineMode
  ) => {
    let red_color = MathExtra.cosine(red.a, red.b, red.c, red.d);
    let green_color = MathExtra.cosine(green.a, green.b, green.c, green.d);
    let blue_color = MathExtra.cosine(blue.a, blue.b, blue.c, blue.d);

    return function (t: number) {
      let r = red_color(t);
      let g = green_color(t);
      let b = blue_color(t);

      // Creates a nice cut effect where we jump between colors
      if (mode !== undefined && mode.toUpperCase() === "MOD") {
        r = MathExtra.mod(r, 1);
        g = MathExtra.mod(g, 1);
        b = MathExtra.mod(b, 1);
      } else {
        r = p5.abs(r);
        g = p5.abs(g);
        b = p5.abs(b);
      }

      return p5.color(p5.floor(r * 256), p5.floor(g * 256), p5.floor(b * 256));
    };
  };

/**
 *
 * @param {Color} c1
 * @param {Color} c2
 * @returns returns a function that performs a cos interpolation between the two colors
 */
// export const cos_gradient =   (p5: p5Types) => (c1: p5Types.Color, c2: p5Types.Color) => {
//   let rgbf = function (t: number) {
//     let w = 0.5 + 0.5 * Math.cos((t * p5.PI) / 2);
//     let r = c1.getRed() * w + c2.getRed() * (1 - w);
//     let g = c1.getGreen() * w + c2.getGreen() * (1 - w);
//     let b = c1.getBlue() * w + c2.getBlue() * (1 - w);
//     let c = p5.color(r, g, b);
//     return c;
//   };

//   if (c1.mode === "rgb") {
//     return rgbf;
//   } else {
//     throw Error(
//       "Colors or not in RGB mode. Please finish implementation. Color mode: " +
//         c1.mode
//     );
//   }
// }
