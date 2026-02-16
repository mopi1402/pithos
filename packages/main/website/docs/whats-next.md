---
sidebar_position: 3
sidebar_label: "What's Next?"
title: "What's Next? — Comparisons & Real Data"
description: "Now that you know the modules, see how they compare to Lodash, Zod, and Neverthrow with real benchmarks and bundle size data."
---

import Link from "@docusaurus/Link";
import { ZygosSizeHighlight } from '@site/src/components/comparisons/zygos/BundleSizeTable';

# 🔭 What's Next?

You've seen what each module does. Now see how they stack up against the alternatives — with real numbers, not marketing claims.

<div className="row" style={{marginTop: '1.5rem'}}>
  <div className="col col--6" style={{marginBottom: '1rem'}}>
    <Link className="card padding--md basics-card" to="/comparisons/overview/">
      <span className="basics-card__emoji">⚖️</span>
      <div className="basics-card__text">
        <strong>When to Use What</strong>
        <span>Quick guide: which Pithos module replaces which library, and when</span>
      </div>
    </Link>
  </div>
  <div className="col col--6" style={{marginBottom: '1rem'}}>
    <Link className="card padding--md basics-card" to="/comparisons/arkhe/bundle-size/">
      <span className="basics-card__emoji">📦</span>
      <div className="basics-card__text">
        <strong>Arkhe vs Lodash</strong>
        <span>Per-function bundle size and performance benchmarks</span>
      </div>
    </Link>
  </div>
  <div className="col col--6" style={{marginBottom: '1rem'}}>
    <Link className="card padding--md basics-card" to="/comparisons/kanon/kanon-vs-zod/">
      <span className="basics-card__emoji">🅺</span>
      <div className="basics-card__text">
        <strong>Kanon vs Zod</strong>
        <span>Bundle size, performance, API compatibility, and migration path</span>
      </div>
    </Link>
  </div>
  <div className="col col--6" style={{marginBottom: '1rem'}}>
    <Link className="card padding--md basics-card" to="/comparisons/zygos/zygos-vs-neverthrow/">
      <span className="basics-card__emoji">🆉</span>
      <div className="basics-card__text">
        <strong>Zygos vs Neverthrow</strong>
        <span><ZygosSizeHighlight type="ratio" />, 2-4x faster — with 100% API compatibility</span>
      </div>
    </Link>
  </div>
  <div className="col col--6" style={{marginBottom: '1rem'}}>
    <Link className="card padding--md basics-card" to="/comparisons/equivalence-table/">
      <span className="basics-card__emoji">📋</span>
      <div className="basics-card__text">
        <strong>Equivalence Table</strong>
        <span>Full Lodash → Pithos function mapping across all modules</span>
      </div>
    </Link>
  </div>
</div>

:::tip
All benchmark data and bundle sizes are auto-generated from real measurements. You can [reproduce them yourself](/comparisons/reproduce/).
:::
