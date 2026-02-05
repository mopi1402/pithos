// Snapshot tests: overloaded signatures, merged interfaces, <details> collapse.

import { describe } from "vitest";
import { snapshotDoc } from "./snapshot-helper.js";

describe("Overloads", () => {
    // Overloaded signatures + merged interface
    snapshotDoc("castComparator (overloads + merged interface)", "arkhe/function/castComparator.md");

    // Overloaded signatures (type guard variant)
    snapshotDoc("partition (overloads, type guard)", "arkhe/array/partition.md");

    // Many overloads collapsed with <details>
    snapshotDoc("pipe (many overloads, collapsed)", "arkhe/function/pipe.md");

    // @deprecated + overloads (taphos collection)
    snapshotDoc("every (@deprecated, overloads)", "taphos/collection/every.md");

    // flowRight — overloads
    snapshotDoc("flowRight (overloads)", "arkhe/function/flowRight.md");
});
