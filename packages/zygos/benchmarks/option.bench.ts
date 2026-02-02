import { bench, describe } from "vitest";
import * as OptionZygos from "../../pithos/src/zygos/option";
import * as OptionFpTs from "fp-ts/Option";
import { pipe } from "fp-ts/function";

describe("option/some-creation", () => {
  bench("zygos/some", () => {
    OptionZygos.some(42);
  });

  bench("fp-ts/some", () => {
    OptionFpTs.some(42);
  });
});

describe("option/fromNullable", () => {
  const value: number | null = 42;

  bench("zygos/fromNullable", () => {
    OptionZygos.fromNullable(value);
  });

  bench("fp-ts/fromNullable", () => {
    OptionFpTs.fromNullable(value);
  });
});

describe("option/fromNullable-null", () => {
  const value: number | null = null;

  bench("zygos/fromNullable", () => {
    OptionZygos.fromNullable(value);
  });

  bench("fp-ts/fromNullable", () => {
    OptionFpTs.fromNullable(value);
  });
});

describe("option/map", () => {
  const zygosOption = OptionZygos.some(10);
  const fptsOption = OptionFpTs.some(10);

  bench("zygos/map", () => {
    OptionZygos.map((x: number) => x * 2)(zygosOption);
  });

  bench("fp-ts/map", () => {
    pipe(fptsOption, OptionFpTs.map((x) => x * 2));
  });
});

describe("option/flatMap", () => {
  const zygosOption = OptionZygos.some(10);
  const fptsOption = OptionFpTs.some(10);

  bench("zygos/flatMap", () => {
    OptionZygos.flatMap((x: number) => OptionZygos.some(x * 2))(zygosOption);
  });

  bench("fp-ts/flatMap", () => {
    pipe(fptsOption, OptionFpTs.flatMap((x) => OptionFpTs.some(x * 2)));
  });
});

describe("option/match", () => {
  const zygosOption = OptionZygos.some(42);
  const fptsOption = OptionFpTs.some(42);

  bench("zygos/match", () => {
    OptionZygos.match(
      () => "none",
      (v: number) => `some: ${v}`
    )(zygosOption);
  });

  bench("fp-ts/match", () => {
    pipe(
      fptsOption,
      OptionFpTs.match(
        () => "none",
        (v) => `some: ${v}`
      )
    );
  });
});

describe("option/getOrElse", () => {
  const zygosOption = OptionZygos.some(42);
  const fptsOption = OptionFpTs.some(42);

  bench("zygos/getOrElse", () => {
    OptionZygos.getOrElse(() => 0)(zygosOption);
  });

  bench("fp-ts/getOrElse", () => {
    pipe(fptsOption, OptionFpTs.getOrElse(() => 0));
  });
});

describe("option/isSome", () => {
  const zygosOption = OptionZygos.some(42);
  const fptsOption = OptionFpTs.some(42);

  bench("zygos/isSome", () => {
    OptionZygos.isSome(zygosOption);
  });

  bench("fp-ts/isSome", () => {
    OptionFpTs.isSome(fptsOption);
  });
});
