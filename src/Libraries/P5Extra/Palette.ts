import p5Types from "p5";
import * as MathExtra from "../MathExtra";
import * as P from "parsimmon";
import * as PExtra from "src/Libraries/ParsimmonExtra";
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

export namespace Cosine {
  export type Palette = {
    red: Color;
    green: Color;
    blue: Color;
    mode: Mode;
  };

  export type Color = {
    a: number;
    b: number;
    c: number;
    d: number;
  };

  export type Mode = "MOD" | "SMOOTH";

  function encodeMode(mode: Mode): string {
    return mode === "MOD" ? "M" : "S";
  }

  const decodeMode: P.Parser<Mode> = P.oneOf("MS").map((s) =>
    s === "M" ? ("Mod" as Mode) : "SMOOTH"
  );

  function encodeC(color: Color): string {
    const parts = [color.a + "", color.b + "", color.c + "", color.d + ""];
    return parts.join(":");
  }

  const decodeC: P.Parser<Color> = P.seqMap(
    PExtra.floating,
    P.string(":"),
    PExtra.floating,
    P.string(":"),
    PExtra.floating,
    P.string(":"),
    PExtra.floating,
    (a, x, b, y, c, z, d) => ({ a: a, b: b, c: c, d: d })
  );

  export function encode(palette: Palette): string {
    return `b${encodeC(palette.blue)}r${encodeC(palette.red)}g${encodeC(
      palette.green
    )}:${encodeMode(palette.mode)}`;
  }

  export const decode: P.Parser<Palette> = P.seqMap(
    P.string("b"),
    decodeC,
    P.string("r"),
    decodeC,
    P.string("g"),
    decodeC,
    P.string(":"),
    decodeMode,
    (x, b, y, r, z, g, v, m) => ({ red: r, green: g, blue: b, mode: m })
  );

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
  export const apply = (p5: p5Types) => (palette: Palette) => {
    const red = palette.red;
    const green = palette.green;
    const blue = palette.blue;
    let red_color = MathExtra.cosine(red.a, red.b, red.c, red.d);
    let green_color = MathExtra.cosine(green.a, green.b, green.c, green.d);
    let blue_color = MathExtra.cosine(blue.a, blue.b, blue.c, blue.d);

    return function (t: number) {
      let r = red_color(t);
      let g = green_color(t);
      let b = blue_color(t);

      // Creates a nice cut effect where we jump between colors
      if (palette.mode !== undefined && palette.mode.toUpperCase() === "MOD") {
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
}
