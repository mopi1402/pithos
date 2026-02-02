import { bench, describe } from "vitest";
import { ok as okZygos, err as errZygos, Result as ResultZygos } from "../../pithos/src/zygos/result/result";
import { ok as okNeverthrow, err as errNeverthrow, Result as ResultNeverthrow } from "neverthrow";

describe("result/andThen-ok", () => {
  const zygosOk = okZygos(10);
  const neverthrowOk = okNeverthrow(10);

  bench("zygos/andThen", () => {
    zygosOk.andThen((x) => okZygos(x * 2));
  });

  bench("neverthrow/andThen", () => {
    neverthrowOk.andThen((x) => okNeverthrow(x * 2));
  });
});

describe("result/andThen-err", () => {
  const zygosErr = errZygos<number, string>("error");
  const neverthrowErr = errNeverthrow<number, string>("error");

  bench("zygos/andThen", () => {
    zygosErr.andThen((x) => okZygos(x * 2));
  });

  bench("neverthrow/andThen", () => {
    neverthrowErr.andThen((x) => okNeverthrow(x * 2));
  });
});

describe("result/andThen-chain", () => {
  const validate = (x: number): ResultZygos<number, string> =>
    x > 0 ? okZygos(x) : errZygos("negative");
  const double = (x: number): ResultZygos<number, string> => okZygos(x * 2);
  const addTen = (x: number): ResultZygos<number, string> => okZygos(x + 10);

  const validateNT = (x: number): ResultNeverthrow<number, string> =>
    x > 0 ? okNeverthrow(x) : errNeverthrow("negative");
  const doubleNT = (x: number): ResultNeverthrow<number, string> => okNeverthrow(x * 2);
  const addTenNT = (x: number): ResultNeverthrow<number, string> => okNeverthrow(x + 10);

  bench("zygos/andThen-chain", () => {
    validate(5).andThen(double).andThen(addTen);
  });

  bench("neverthrow/andThen-chain", () => {
    validateNT(5).andThen(doubleNT).andThen(addTenNT);
  });
});
