---
sidebar_position: 4
sidebar_label: "Et ensuite ?"
title: "Et ensuite ? — Comparaisons & données réelles"
description: "Maintenant que vous connaissez les modules, découvrez comment ils se comparent à Lodash, Zod et Neverthrow avec de vrais benchmarks et données de taille de bundle."
---

import Link from "@docusaurus/Link";
import { ZygosSizeHighlight } from '@site/src/components/comparisons/zygos/BundleSizeTable';

# 🔭 Et ensuite ?

Maintenant vous savez ce que fait chaque module.  
Maitenant, jetez un oeil à ses performances : De vrais chiffres, pas d'arguments marketing.

<div className="row" style={{marginTop: '1.5rem'}}>
  <div className="col col--6" style={{marginBottom: '1rem'}}>
    <Link className="card padding--md basics-card" to="/comparisons/overview/">
      <span className="basics-card__emoji">⚖️</span>
      <div className="basics-card__text">
        <strong>Quand utiliser quoi</strong>
        <span>Guide rapide : Pithos, une vrai alternative aux solutions du quotidien</span>
      </div>
    </Link>
  </div>
  <div className="col col--6" style={{marginBottom: '1rem'}}>
    <Link className="card padding--md basics-card" to="/comparisons/arkhe/bundle-size/">
      <span className="basics-card__emoji">📦</span>
      <div className="basics-card__text">
        <strong>Arkhe vs Lodash</strong>
        <span>Taille de bundle par fonction et benchmarks de performance</span>
      </div>
    </Link>
  </div>
  <div className="col col--6" style={{marginBottom: '1rem'}}>
    <Link className="card padding--md basics-card" to="/comparisons/kanon/kanon-vs-zod/">
      <span className="basics-card__emoji">🅺</span>
      <div className="basics-card__text">
        <strong>Kanon vs Zod</strong>
        <span>Taille de bundle, performance, compatibilité API et chemin de migration</span>
      </div>
    </Link>
  </div>
  <div className="col col--6" style={{marginBottom: '1rem'}}>
    <Link className="card padding--md basics-card" to="/comparisons/zygos/zygos-vs-neverthrow/">
      <span className="basics-card__emoji">🆉</span>
      <div className="basics-card__text">
        <strong>Zygos vs Neverthrow</strong>
        <span><ZygosSizeHighlight type="ratio" />, 2-4x plus rapide — avec 100% de compatibilité API</span>
      </div>
    </Link>
  </div>
  <div className="col col--6" style={{marginBottom: '1rem'}}>
    <Link className="card padding--md basics-card" to="/comparisons/equivalence-table/">
      <span className="basics-card__emoji">📋</span>
      <div className="basics-card__text">
        <strong>Table d'équivalence</strong>
        <span>Correspondance complète des fonctions Lodash → Pithos à travers tous les modules</span>
      </div>
    </Link>
  </div>
</div>

:::info
Toutes les données de benchmark et tailles de bundle sont générées automatiquement à partir de mesures réelles. Vous pouvez [les reproduire vous-même](/comparisons/reproduce/).
:::
