// Snapshot tests: @see sections, internal links, external links.

import { describe } from "vitest";
import { snapshotDoc } from "./snapshot-helper.js";

describe("See / Links", () => {
    // @see with internal function reference
    snapshotDoc("escape (@see internal ref)", "arkhe/string/escape.md");

    // Multiple @see tags
    snapshotDoc("pickBy (multiple @see)", "arkhe/object/pickBy.md");

    // @see with external links
    snapshotDoc("toPairs (@see external)", "taphos/object/toPairs.md");

    // @see in get
    snapshotDoc("get (@see)", "arkhe/object/get.md");

    // Parsers with internal links (URL regression test)
    snapshotDoc("parseFloatDef (parsers, @see)", "arkhe/number/parsers/parseFloatDef.md");

    // parseIntDef — same category
    snapshotDoc("parseIntDef (parsers, @see)", "arkhe/number/parsers/parseIntDef.md");
});
