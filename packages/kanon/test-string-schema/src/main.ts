// Test: Import direct de coerceString
import { string as stringV3 } from "@kanon/schemas/primitives/string";
import { bigint as bigintV3 } from "@kanon/schemas/primitives/bigint";
import { date as dateV3 } from "@kanon/schemas/primitives/date";
import { number as numberV3 } from "@kanon/schemas/primitives/number";
import { boolean as booleanV3 } from "@kanon/schemas/primitives/boolean";
import { any as anyV3 } from "@kanon/schemas/primitives/any";
import { unknown as unknownV3 } from "@kanon/schemas/primitives/unknown";
import { never as neverV3 } from "@kanon/schemas/primitives/never";
import { null_ as nullV3 } from "@kanon/schemas/primitives/null";
import { undefined_ as undefinedV3 } from "@kanon/schemas/primitives/undefined";
import { symbol as symbolV3 } from "@kanon/schemas/primitives/symbol";
import { void_ as voidV3 } from "@kanon/schemas/primitives/void";
import { array as arrayV3 } from "@kanon/schemas/composites/array";
import { object as objectV3 } from "@kanon/schemas/composites/object";

// Test simple pour voir si ça tire bigint/date
export const testCoerceString = () => {
  let s = stringV3();
  let b = bigintV3();
  let d = dateV3();
  let n = numberV3();
  let bo = booleanV3();
  let nu = nullV3();
  let un = undefinedV3();
  let an = anyV3();
  let sy = symbolV3();
  let unk = unknownV3();
  let ne = neverV3();
  let vo = voidV3();
  let o = objectV3({
    name: stringV3(),
    age: numberV3(),
    active: booleanV3(),
  });
  let arr = arrayV3(stringV3());

  console.log(s, b, d, n, bo, nu, un, an, sy, unk, ne, vo, arr, o);
};
