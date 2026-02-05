// Snapshot tests: classes, interfaces, type aliases, variables.

import { describe } from "vitest";
import { snapshotDoc } from "./snapshot-helper.js";

describe("Classes — zygos", () => {
    // Class with properties + methods (Err)
    snapshotDoc("err (class, properties, methods)", "zygos/result/err.md");

    // Class with overloads (Ok)
    snapshotDoc("ok (class, overloads)", "zygos/result/ok.md");

    // ResultAsync class (static methods, async)
    snapshotDoc("ResultAsync (class, async methods)", "zygos/result/ResultAsync.md");
});

describe("Interfaces — zygos", () => {
    // Interface with properties (Left)
    snapshotDoc("left (interface, properties)", "zygos/either/left.md");

    // Interface with properties (Right)
    snapshotDoc("right (interface, properties)", "zygos/either/right.md");

    // Interface with properties (Some)
    snapshotDoc("some (interface, properties)", "zygos/option/some.md");

    // Type alias (Either)
    snapshotDoc("Either (type alias)", "zygos/either/Either.md");

    // Type alias (Result)
    snapshotDoc("Result (type alias)", "zygos/result/Result.md");
});

describe("Types — kanon", () => {
    // Kanon Schema interface (complex type)
    snapshotDoc("Schema (kanon, interface)", "kanon/types/base/Schema.md");

    // Kanon extension type (function-type properties)
    snapshotDoc("ObjectExtension (kanon, type)", "kanon/types/constraints/ObjectExtension.md");

    // Kanon schema (different module)
    snapshotDoc("string schema (kanon)", "kanon/schemas/primitives/string.md");
});

describe("Types — arkhe", () => {
    // Interface with properties (Point)
    snapshotDoc("Point (interface)", "arkhe/types/math/Point.md");

    // Interface with properties (Interval)
    snapshotDoc("Interval (interface)", "arkhe/types/math/Interval.md");

    // ConsoleMock (interface with method-like properties)
    snapshotDoc("ConsoleMock (interface)", "arkhe/test/ConsoleMock.md");
});
