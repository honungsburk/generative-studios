import { expect, test } from "vitest";
import * as UrlEncode from "./UrlEncode";
import * as ConstrainedNumber from "./ConstrainedNumber";

////////////////////////////////////////////////////////////////////////////////
// Validate Schema
////////////////////////////////////////////////////////////////////////////////

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
  const numC = { min: 10, step: 1, max: 100 };
  const build = ConstrainedNumber.fromNumber(numC);
  const buildOther = ConstrainedNumber.fromNumber({
    min: 11,
    step: 1,
    max: 100,
  });
  const schema = UrlEncode.VConstrainedNumber(numC);
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

test("Validate a VArray schema", () => {
  const schema = UrlEncode.VArray(UrlEncode.VNumber);
  expect(UrlEncode.validate(schema)("1")).false;
  expect(UrlEncode.validate(schema)(["1"])).false;
  expect(UrlEncode.validate(schema)([1, 2, 3, 4])).true;
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

test("Validate a VOr schema", () => {
  const schema = UrlEncode.VOr([UrlEncode.VBoolean, UrlEncode.VString]);

  expect(UrlEncode.validate(schema)(true)).true;
  expect(UrlEncode.validate(schema)("String")).true;
  expect(UrlEncode.validate(schema)(1.2123)).false;
});

test("Validate a tagged union", () => {
  const easy = UrlEncode.VObject({
    kind: UrlEncode.VEnumString(["Easy"]),
  });
  expect(UrlEncode.validateWithErr(easy)({ kind: "Easy" })).true;
});

test("Validate a VOr schema with tagged union", () => {
  const easy = UrlEncode.VObject({
    kind: UrlEncode.VEnumString(["Easy"]),
  });
  const schema = UrlEncode.VOr([
    easy,
    UrlEncode.VObject({
      kind: UrlEncode.VEnumString(["Hard"]),
    }),
  ]);

  // expect(UrlEncode.validate(schema)(true)).false;
  expect(UrlEncode.validate(easy)({ kind: "Easy" })).true;
  // expect(UrlEncode.validate(schema)({ kind: "Easy" })).true;
  // expect(UrlEncode.validate(schema)({ kind: "hard" })).true;
});

////////////////////////////////////////////////////////////////////////////////
// keyShrink
////////////////////////////////////////////////////////////////////////////////

test("keyShrink can compress and expand", () => {
  const schema = UrlEncode.VObject({
    boolean: UrlEncode.VBoolean,
    string: UrlEncode.VString,
    number: UrlEncode.VNumber,
    object: UrlEncode.VObject({
      element: UrlEncode.VBoolean,
    }),
  });

  const shrink = UrlEncode.keyShrink(schema);

  const ex1 = {
    boolean: true,
    string: "hello",
    number: 1.1238,
    object: {
      element: false,
    },
  };

  expect(shrink.decode(shrink.encode(ex1))).toStrictEqual(ex1);
  expect(UrlEncode.validate(shrink.schema)(shrink.encode(ex1))).true;
});

test("keyShrink can compress a VOr schema", () => {
  const schema1 = UrlEncode.VObject({
    boolean: UrlEncode.VBoolean,
    string: UrlEncode.VString,
    number: UrlEncode.VNumber,
    object: UrlEncode.VObject({
      element: UrlEncode.VBoolean,
    }),
  });
  const schema = UrlEncode.VOr([UrlEncode.VBoolean, schema1]);

  const shrink = UrlEncode.keyShrink(schema);

  const ex1 = {
    boolean: true,
    string: "hello",
    number: 1.1238,
    object: {
      element: false,
    },
  };

  const ex2 = true;

  expect(shrink.decode(shrink.encode(ex1))).toStrictEqual(ex1);
  expect(shrink.decode(shrink.encode(ex2))).toStrictEqual(ex2);
});

test("keyShrink can compress a VOr schema", () => {
  const schema = UrlEncode.VOr([
    UrlEncode.VObject({
      kind: UrlEncode.VEnumString(["one"]),
      value1: UrlEncode.VBoolean,
    }),
    UrlEncode.VObject({
      kind: UrlEncode.VEnumString(["two"]),
      value2: UrlEncode.VBoolean,
    }),
  ]);

  const shrink = UrlEncode.keyShrink(schema);

  const ex1 = {
    kind: "one",
    value1: true,
  };

  const ex2 = {
    kind: "two",
    value2: true,
  };

  const ex3 = true;

  expect(shrink.decode(shrink.encode(ex1))).toStrictEqual(ex1);
  expect(shrink.decode(shrink.encode(ex2))).toStrictEqual(ex2);
  expect(() => shrink.decode(shrink.encode(ex3))).throw;
});

test("keyShrink can compress a keys inside of arrays", () => {
  const schema = UrlEncode.VArray(
    UrlEncode.VObject({
      kind: UrlEncode.VEnumString(["one"]),
      value1: UrlEncode.VBoolean,
    })
  );

  const shrink = UrlEncode.keyShrink(schema);

  const ex1 = [
    {
      kind: "one",
      value1: true,
    },
  ];

  const ex2 = [
    {
      kind: "two",
      value1: false,
    },
  ];

  const ex3 = [true];

  expect(
    Object.keys((shrink.encode(ex1) as Object[])[0])[0].length
  ).toStrictEqual(1);
  expect(shrink.decode(shrink.encode(ex1))).toStrictEqual(ex1);
  expect(shrink.decode(shrink.encode(ex2))).toStrictEqual(ex2);
  expect(() => shrink.decode(shrink.encode(ex3))).throw;
});

////////////////////////////////////////////////////////////////////////////////
// EnumStringCompress
////////////////////////////////////////////////////////////////////////////////

test("EnumStringCompress can compress and expand", () => {
  const schema = UrlEncode.VObject({
    enum: UrlEncode.VEnumString(["hello", "world"]),
    object: UrlEncode.VObject({
      element: UrlEncode.VEnumString(["hello", "world2"]),
    }),
  });

  const shrink = UrlEncode.valueCompress(schema);

  const ex1 = {
    enum: "hello",
    object: {
      element: "world2",
    },
  };

  expect(shrink.decode(shrink.encode(ex1))).toStrictEqual(ex1);
});

test("EnumStringCompress can compress and expand VOr EnumStrings", () => {
  const schema = UrlEncode.VOr([
    UrlEncode.VEnumString(["hello", "world"]),
    UrlEncode.VEnumString(["hello1", "world1"]),
  ]);

  const shrink = UrlEncode.valueCompress(schema);

  const ex1 = "hello";
  const ex2 = "world";
  const ex3 = "hello1";
  const ex4 = "world1";

  expect(shrink.decode(shrink.encode(ex1))).toStrictEqual(ex1);
  expect(shrink.decode(shrink.encode(ex2))).toStrictEqual(ex2);
  expect(shrink.decode(shrink.encode(ex3))).toStrictEqual(ex3);
  expect(shrink.decode(shrink.encode(ex4))).toStrictEqual(ex4);
});

test("EnumStringCompress can compress and expand VOr Objects with overlapping key names", () => {
  const schema = UrlEncode.VOr([
    UrlEncode.VObject({
      kind: UrlEncode.VEnumString(["hello"]),
      value: UrlEncode.VBoolean,
    }),
    UrlEncode.VObject({
      kind: UrlEncode.VEnumString(["hello2"]),
      value: UrlEncode.VNumber,
    }),
  ]);

  const shrink = UrlEncode.valueCompress(schema);

  const ex1 = {
    kind: "hello",
    value: true,
  };
  const ex2 = {
    kind: "hello2",
    value: 1.23,
  };

  expect(shrink.decode(shrink.encode(ex1))).toStrictEqual(ex1);
  expect(shrink.decode(shrink.encode(ex2))).toStrictEqual(ex2);

  const ex3 = {
    kind: "hello2",
    value: true,
  };

  expect(() => shrink.encode(ex3)).throw();
});

test("EnumStringCompress can compress and expand VOr EnumStrings", () => {
  const numC = { min: 1, max: 10, step: 0.01 };
  const mkNum = ConstrainedNumber.fromNumber(numC);
  const schema = UrlEncode.VConstrainedNumber(numC);

  const shrink = UrlEncode.valueCompress(schema);

  const ex1 = mkNum(5);
  const ex2 = mkNum(1);
  expect(shrink.decode(shrink.encode(ex1))).toStrictEqual(ex1);
  expect(shrink.decode(shrink.encode(ex2))).toStrictEqual(ex2);
});

test("EnumStringCompress can compress and expand VArray EnumStrings", () => {
  const schema = UrlEncode.VArray(UrlEncode.VEnumString(["hi", "hello"]));

  const shrink = UrlEncode.valueCompress(schema);

  const ex1 = ["hi", "hi", "hello"];
  const ex2: typeof ex1 = [];
  expect((shrink.encode(ex1) as string[])[0].length).toStrictEqual(1);
  expect(shrink.decode(shrink.encode(ex1))).toStrictEqual(ex1);
  expect(shrink.decode(shrink.encode(ex1))).toStrictEqual(ex1);
  expect(shrink.decode(shrink.encode(ex2))).toStrictEqual(ex2);
});

////////////////////////////////////////////////////////////////////////////////
// construct
////////////////////////////////////////////////////////////////////////////////

test("Construct can encode and decode", async () => {
  const cnum = { min: 1, max: 10, step: 1 };
  const mkNum = ConstrainedNumber.fromNumber(cnum);
  const schema = UrlEncode.VObject({
    boolean: UrlEncode.VBoolean,
    num: UrlEncode.VNumber,
    enum: UrlEncode.VEnumString(["hello", "world"]),
    object: UrlEncode.VObject({
      element: UrlEncode.VEnumString(["hello", "world2"]),
      cnum: UrlEncode.VConstrainedNumber(cnum),
      array: UrlEncode.VArray(UrlEncode.VNumber),
    }),
  });

  const shrink = UrlEncode.construct(schema);

  const ex1 = {
    boolean: true,
    num: 3.626,
    enum: "hello",
    object: {
      element: "world2",
      cnum: mkNum(6),
      array: [2.3],
    },
  };

  const ex2 = await shrink.decode(shrink.encode(ex1));
  expect(ex2).toStrictEqual(ex1);
});
