import { bench, describe } from "vitest";
import { Result as ResultZygos } from "../../pithos/src/zygos/result/result";
import { Result as ResultNeverthrow } from "neverthrow";

// Cast to bypass strict typing - this is a benchmark, not a type test
const jsonParse = JSON.parse as (text: unknown) => unknown;

describe("result/fromThrowable-success", () => {
  const safeParseZygos = ResultZygos.fromThrowable(
    jsonParse,
    (e) => String(e)
  );
  const safeParseNeverthrow = ResultNeverthrow.fromThrowable(JSON.parse, (e) => String(e));
  const validJson = '{"name":"John","age":30}';

  bench("zygos/fromThrowable", () => {
    safeParseZygos(validJson);
  });

  bench("neverthrow/fromThrowable", () => {
    safeParseNeverthrow(validJson);
  });
});

describe("result/fromThrowable-error", () => {
  const safeParseZygos = ResultZygos.fromThrowable(
    jsonParse,
    (e) => String(e)
  );
  const safeParseNeverthrow = ResultNeverthrow.fromThrowable(JSON.parse, (e) => String(e));
  const invalidJson = "not valid json";

  bench("zygos/fromThrowable", () => {
    safeParseZygos(invalidJson);
  });

  bench("neverthrow/fromThrowable", () => {
    safeParseNeverthrow(invalidJson);
  });
});
