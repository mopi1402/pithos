// Snapshot tests: core function formatting, parameters, returns, examples.

import { describe } from "vitest";
import { snapshotDoc } from "./snapshot-helper.js";

describe("Functions — core formatting", () => {
    // Simple function with @throws + @see
    snapshotDoc("after (@throws, @see)", "arkhe/function/after.md");

    // Function returning function (nested Returns signature)
    snapshotDoc("before (nested return)", "arkhe/function/before.md");

    // Simple string util with @note + @performance
    snapshotDoc("camelCase (string util)", "arkhe/string/camelCase.md");

    // Noop — minimal function, no params
    snapshotDoc("noop (minimal)", "arkhe/function/noop.md");

    // Negate — higher-order function
    snapshotDoc("negate (higher-order)", "arkhe/function/negate.md");

    // flip — function manipulation
    snapshotDoc("flip (function manipulation)", "arkhe/function/flip.md");

    // once — simple wrapper
    snapshotDoc("once (wrapper)", "arkhe/function/once.md");
});

describe("Functions — taphos (lodash compat)", () => {
    // Simple taphos function
    snapshotDoc("head (taphos, simple)", "taphos/array/head.md");

    // Taphos with description
    snapshotDoc("flatten (taphos)", "taphos/array/flatten.md");

    // Taphos math
    snapshotDoc("add (taphos, math)", "taphos/math/add.md");

    // Taphos lang
    snapshotDoc("eq (taphos, lang)", "taphos/lang/eq.md");
});
