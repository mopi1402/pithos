// Snapshot tests: admonitions (@info, @note, @throws, @deprecated, @tip, @performance, @defaultValue).

import { describe } from "vitest";
import { snapshotDoc } from "./snapshot-helper.js";

describe("Admonitions — @throws", () => {
    // @throws with single-line content (Setext heading regression)
    snapshotDoc("chunk (@throws, single line)", "arkhe/array/chunk.md");

    // @throws + @note + @defaultValue
    snapshotDoc("parallel (@throws, @note, @defaultValue)", "arkhe/async/parallel.md");

    // @throws + @see
    snapshotDoc("after (@throws, @see)", "arkhe/function/after.md");

    // @throws in debounce
    snapshotDoc("debounce (@throws)", "arkhe/function/debounce.md");

    // @throws in throttle
    snapshotDoc("throttle (@throws)", "arkhe/function/throttle.md");

    // @throws in sleep
    snapshotDoc("sleep (@throws)", "arkhe/util/sleep.md");
});

describe("Admonitions — @info, @note, @deprecated", () => {
    // Multiple @info tags
    snapshotDoc("orderBy (multiple @info)", "arkhe/array/orderBy.md");

    // @info + @throws + merged interface (RetryOptions)
    snapshotDoc("retry (@info, @throws, merged interface)", "arkhe/async/retry.md");

    // @deprecated + @see external link
    snapshotDoc("toPairs (@deprecated, @see external)", "taphos/object/toPairs.md");

    // @note + @performance + ligature table
    snapshotDoc("deburr (@note, @performance, complex content)", "arkhe/string/deburr.md");

    // Multiple @note + @performance + multiple @see
    snapshotDoc("get (multiple @note, @performance, @see)", "arkhe/object/get.md");
});
