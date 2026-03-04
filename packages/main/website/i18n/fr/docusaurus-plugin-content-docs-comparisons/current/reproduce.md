---
sidebar_label: "Reproduire nos données"
sidebar_position: 99
title: "Reproduire nos benchmarks et données de taille de bundle"
description: "Comment vérifier vous-même les résultats de benchmarks et les comparaisons de taille de bundle de Pithos. Toutes les commandes pour régénérer les données depuis les sources."
---

import { RepoCloneUrl } from '@site/src/components/shared/RepoUrl';
import { FeatureSection } from '@site/src/components/shared/FeatureSection';
import { Picture } from '@site/src/components/shared/Picture';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# 🏮 Reproduire nos données

<FeatureSection
  image={
    <Picture
      src="/img/comparisons/diogenes-testing-pithos"
      alt="Diogène testant les benchmarks Pithos"
      displaySize={200}
    />
  }
  imagePosition="left"
>

Chaque chiffre sur ces pages de comparaison est auto-généré depuis les sources.

Si, comme Diogène, vous ne faites confiance à aucune affirmation sans vérification, voici tout ce qu'il vous faut pour vérifier les nôtres.

*Benchmarké sur MacBook Pro 2023 (M2 Pro), 32 Go RAM, macOS 26.2, branché sur secteur.*
*Les résultats sur batterie montrent des différences relatives similaires.*

</FeatureSection>

## Installation

Clonez le dépôt et installez les dépendances :

<pre><code>git clone <RepoCloneUrl />{"\n"}cd pithos{"\n"}pnpm install</code></pre>

:::tip[CLI interactif]
Pithos inclut un CLI interactif qui vous permet de parcourir et exécuter toutes les commandes de benchmark et de génération depuis un menu visuel :

```bash
pnpm cli
```

Naviguez avec les flèches, sélectionnez une commande et exécutez-la directement.
:::

## Taille de bundle

Mesurez n'importe quel import manuellement avec esbuild :

```bash
# Fonction unique
echo 'import { chunk } from "pithos/arkhe/array/chunk"' | \
  esbuild --bundle --minify | gzip -c | wc -c

# Schéma Kanon
echo 'import { string, object, parse } from "pithos/kanon"' | \
  esbuild --bundle --minify | gzip -c | wc -c
```

Régénérez les données de comparaison complètes utilisées dans les pages de comparaison de taille de bundle avec ces commandes :

```bash
# Tailles de bundle Arkhe & Taphos
pnpm doc:generate-arkhe-taphos-bundle-sizes

# Tailles de bundle Kanon
cd packages/main/website
npx tsx scripts/generate-bundle-data.ts

# Tailles de bundle Zygos
pnpm doc:generate-zygos-bundle-sizes
```

## Benchmarks de performance

Exécutez les benchmarks par module :

```bash
# Arkhe
pnpm benchmark:arkhe
pnpm doc:generate:arkhe:benchmarks-results

# Kanon
pnpm benchmark:kanon realworld all

# Taphos
pnpm benchmark:taphos
pnpm doc:generate:taphos:benchmarks-results

# Zygos
pnpm benchmark:zygos
pnpm doc:generate:zygos:benchmarks-results
```

## Environnement

Les résultats peuvent varier selon votre matériel et votre version de Node.js. Nos données publiées sont générées dans un environnement cohérent pour garantir des comparaisons équitables entre les bibliothèques.

---

<RelatedLinks title="Voir les résultats">

- [Arkhe — Taille de bundle](./arkhe/bundle-size.md) — Tailles des fonctions utilitaires vs Lodash, es-toolkit, Remeda
- [Kanon — Performance](./kanon/performances.md) — Benchmarks de validation vs Zod, Valibot, AJV
- [Taphos — Performance](./taphos/performances.md) — Utilitaires dépréciés vs es-toolkit, Lodash
- [Zygos — Performance](./zygos/performances.md) — Benchmarks du pattern Result vs Neverthrow, fp-ts

</RelatedLinks>
