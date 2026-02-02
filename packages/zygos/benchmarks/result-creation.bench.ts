import { bench, describe } from "vitest";
import { ok as okZygos, err as errZygos } from "../../pithos/src/zygos/result/result";
import { ok as okNeverthrow, err as errNeverthrow } from "neverthrow";

describe("result/ok-creation", () => {
  bench("zygos/ok", () => {
    okZygos(42);
  });

  bench("neverthrow/ok", () => {
    okNeverthrow(42);
  });
});

describe("result/err-creation", () => {
  bench("zygos/err", () => {
    errZygos("error");
  });

  bench("neverthrow/err", () => {
    errNeverthrow("error");
  });
});

describe("result/ok-complex", () => {
  const complexValue = { user: { name: "John", age: 30 }, items: [1, 2, 3] };

  bench("zygos/ok", () => {
    okZygos(complexValue);
  });

  bench("neverthrow/ok", () => {
    okNeverthrow(complexValue);
  });
});
