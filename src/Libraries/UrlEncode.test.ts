import { expect, test } from "vitest";
import * as UrlEncode from "./UrlEncode";
import * as ConstrainedNumber from "./ConstrainedNumber";

test("Validate a boolean schema", () => {
  expect(UrlEncode.validate(UrlEncode.VBoolean)(true)).true;
  expect(UrlEncode.validate(UrlEncode.VBoolean)("String")).false;
});

test("Validate a number schema", () => {
  expect(UrlEncode.validate(UrlEncode.VNumber)(1.23)).true;
  expect(UrlEncode.validate(UrlEncode.VNumber)("String")).false;
});

test("Validate a string schema", () => {
  expect(UrlEncode.validate(UrlEncode.VString)("String")).true;
  expect(UrlEncode.validate(UrlEncode.VString)(true)).false;
});

test("Validate a ConstrainedNumber schema", () => {
  const build = ConstrainedNumber.fromNumber({ min: 10, step: 1, max: 100 });
  const buildOther = ConstrainedNumber.fromNumber({
    min: 11,
    step: 1,
    max: 100,
  });
  const schema = UrlEncode.VConstrainedNumber(build);
  expect(UrlEncode.validate(schema)(build(20))).true;
  expect(UrlEncode.validate(schema)(buildOther(20))).false;
  expect(UrlEncode.validate(schema)(true)).false;
});

test("Validate a VEnumString schema", () => {
  const schema = UrlEncode.VEnumString(["1", "2", "3"]);
  expect(UrlEncode.validate(schema)("1")).true;
  expect(UrlEncode.validate(schema)("11")).false;
  expect(UrlEncode.validate(schema)(true)).false;
});

test("Validate a VObject schema", () => {
  const schema = UrlEncode.VObject({
    boolean: UrlEncode.VBoolean,
    string: UrlEncode.VString,
    number: UrlEncode.VNumber,
  });
  expect(
    UrlEncode.validate(schema)({
      boolean: true,
      string: "hello",
      number: 1.2,
    })
  ).true;
  expect(
    UrlEncode.validate(schema)({
      boolean: true,
      string: "hello",
      number: 1.2,
      b2: "hello1",
    })
  ).false;
  expect(
    UrlEncode.validate(schema)({
      boolean: true,
      string: "hello",
    })
  ).false;
  expect(UrlEncode.validate(schema)(true)).false;
});
