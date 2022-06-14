import * as P from "parsimmon";

/**
 * Parse floating point numbers in javascript style
 */
export const floating = P.regexp(/[+-]?([0-9]*[.])?[0-9]+/).map(function (x) {
  return Number(x);
});

/**
 * Parse boolean point numbers in javascript style
 */
export const booleanP = P.oneOf("TF").map((x) => x === "T");

export const booleanE = (b: boolean) => (b ? "T" : "F");
