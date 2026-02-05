// Snapshot tests: special sections (How it works, Use Cases, Hidden Gem, Also known as, Default Value).

import { describe } from "vitest";
import { snapshotDoc } from "./snapshot-helper.js";

describe("Special sections", () => {
    // Hidden Gem badge
    snapshotDoc("findBest (hidden gem)", "arkhe/array/findBest.md");

    // How it works + mermaid diagrams + Use Cases
    snapshotDoc("debounce (how it works, mermaid, use cases)", "arkhe/function/debounce.md");

    // Also known as (aliases)
    snapshotDoc("camelCase (also known as)", "arkhe/string/camelCase.md");

    // @defaultValue
    snapshotDoc("parallel (@defaultValue)", "arkhe/async/parallel.md");

    // Merged interface (RetryOptions)
    snapshotDoc("retry (merged interface)", "arkhe/async/retry.md");

    // Merged interface (TruncateOptions)
    snapshotDoc("truncate (merged interface)", "arkhe/string/truncate.md");

    // Merged interface (MemoizeOptions)
    snapshotDoc("memoize (merged interface)", "arkhe/function/memoize.md");
});
