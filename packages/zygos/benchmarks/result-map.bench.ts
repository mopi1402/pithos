import { bench, describe } from "vitest";
import { ok as okZygos, err as errZygos } from "../../pithos/src/zygos/result/result";
import { ok as okNeverthrow, err as errNeverthrow } from "neverthrow";

describe("result/map-ok", () => {
  const zygosOk = okZygos(10);
  const neverthrowOk = okNeverthrow(10);

  bench("zygos/map", () => {
    zygosOk.map((x) => x * 2);
  });

  bench("neverthrow/map", () => {
    neverthrowOk.map((x) => x * 2);
  });
});

describe("result/map-err", () => {
  const zygosErr = errZygos<number, string>("error");
  const neverthrowErr = errNeverthrow<number, string>("error");

  bench("zygos/map", () => {
    zygosErr.map((x) => x * 2);
  });

  bench("neverthrow/map", () => {
    neverthrowErr.map((x) => x * 2);
  });
});

describe("result/mapErr", () => {
  const zygosErr = errZygos<number, string>("error");
  const neverthrowErr = errNeverthrow<number, string>("error");

  bench("zygos/mapErr", () => {
    zygosErr.mapErr((e) => `wrapped: ${e}`);
  });

  bench("neverthrow/mapErr", () => {
    neverthrowErr.mapErr((e) => `wrapped: ${e}`);
  });
});
