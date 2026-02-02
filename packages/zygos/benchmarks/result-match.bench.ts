import { bench, describe } from "vitest";
import { ok as okZygos, err as errZygos } from "../../pithos/src/zygos/result/result";
import { ok as okNeverthrow, err as errNeverthrow } from "neverthrow";

describe("result/match-ok", () => {
  const zygosOk = okZygos(42);
  const neverthrowOk = okNeverthrow(42);

  bench("zygos/match", () => {
    zygosOk.match(
      (v) => `success: ${v}`,
      (e) => `error: ${e}`
    );
  });

  bench("neverthrow/match", () => {
    neverthrowOk.match(
      (v) => `success: ${v}`,
      (e) => `error: ${e}`
    );
  });
});

describe("result/match-err", () => {
  const zygosErr = errZygos<number, string>("failed");
  const neverthrowErr = errNeverthrow<number, string>("failed");

  bench("zygos/match", () => {
    zygosErr.match(
      (v) => `success: ${v}`,
      (e) => `error: ${e}`
    );
  });

  bench("neverthrow/match", () => {
    neverthrowErr.match(
      (v) => `success: ${v}`,
      (e) => `error: ${e}`
    );
  });
});
