import { bench, describe } from "vitest";
import { ok as okZygos, err as errZygos } from "../../pithos/src/zygos/result/result";
import { ok as okNeverthrow, err as errNeverthrow } from "neverthrow";

describe("result/unwrapOr-ok", () => {
  const zygosOk = okZygos(42);
  const neverthrowOk = okNeverthrow(42);

  bench("zygos/unwrapOr", () => {
    zygosOk.unwrapOr(0);
  });

  bench("neverthrow/unwrapOr", () => {
    neverthrowOk.unwrapOr(0);
  });
});

describe("result/unwrapOr-err", () => {
  const zygosErr = errZygos<number, string>("error");
  const neverthrowErr = errNeverthrow<number, string>("error");

  bench("zygos/unwrapOr", () => {
    zygosErr.unwrapOr(0);
  });

  bench("neverthrow/unwrapOr", () => {
    neverthrowErr.unwrapOr(0);
  });
});

describe("result/isOk", () => {
  const zygosOk = okZygos(42);
  const neverthrowOk = okNeverthrow(42);

  bench("zygos/isOk", () => {
    zygosOk.isOk();
  });

  bench("neverthrow/isOk", () => {
    neverthrowOk.isOk();
  });
});

describe("result/isErr", () => {
  const zygosErr = errZygos<number, string>("error");
  const neverthrowErr = errNeverthrow<number, string>("error");

  bench("zygos/isErr", () => {
    zygosErr.isErr();
  });

  bench("neverthrow/isErr", () => {
    neverthrowErr.isErr();
  });
});
