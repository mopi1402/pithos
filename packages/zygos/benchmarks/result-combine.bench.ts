import { bench, describe } from "vitest";
import { ok as okZygos, err as errZygos, Result as ResultZygos } from "../../pithos/src/zygos/result/result";
import { ok as okNeverthrow, err as errNeverthrow, Result as ResultNeverthrow } from "neverthrow";

describe("result/combine-all-ok", () => {
  const zygosResults = [okZygos(1), okZygos(2), okZygos(3), okZygos(4), okZygos(5)];
  const neverthrowResults = [
    okNeverthrow(1),
    okNeverthrow(2),
    okNeverthrow(3),
    okNeverthrow(4),
    okNeverthrow(5),
  ];

  bench("zygos/combine", () => {
    ResultZygos.combine(zygosResults);
  });

  bench("neverthrow/combine", () => {
    ResultNeverthrow.combine(neverthrowResults);
  });
});

describe("result/combine-with-err", () => {
  const zygosResults = [
    okZygos(1),
    okZygos(2),
    errZygos<number, string>("error"),
    okZygos(4),
    okZygos(5),
  ];
  const neverthrowResults = [
    okNeverthrow(1),
    okNeverthrow(2),
    errNeverthrow<number, string>("error"),
    okNeverthrow(4),
    okNeverthrow(5),
  ];

  bench("zygos/combine", () => {
    ResultZygos.combine(zygosResults);
  });

  bench("neverthrow/combine", () => {
    ResultNeverthrow.combine(neverthrowResults);
  });
});

describe("result/combine-large", () => {
  const zygosResults = Array.from({ length: 100 }, (_, i) => okZygos(i));
  const neverthrowResults = Array.from({ length: 100 }, (_, i) => okNeverthrow(i));

  bench("zygos/combine", () => {
    ResultZygos.combine(zygosResults);
  });

  bench("neverthrow/combine", () => {
    ResultNeverthrow.combine(neverthrowResults);
  });
});
