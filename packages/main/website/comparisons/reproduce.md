---
sidebar_label: "Reproduce Our Data"
sidebar_position: 99
title: "Reproduce Our Benchmarks & Bundle Size Data"
description: "How to verify Pithos benchmark results and bundle size comparisons yourself. All commands to regenerate the data from source."
---

import { RepoCloneUrl } from '@site/src/components/shared/RepoUrl';
import { FeatureSection } from '@site/src/components/shared/FeatureSection';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# 🏮 Reproduce Our Data

<FeatureSection
  imageSrc="/img/comparisons/diogenes-testing-pithos"
  imageAlt="Diogenes testing Pithos benchmarks"
  imagePosition="left"
>

Every number on these comparison pages is auto-generated from source.

If, like Diogenes, you trust no claim at face value, here's everything you need to verify ours.

*Benchmarked on MacBook Pro 2023 (M2 Pro), 32 GB RAM, macOS 26.2, plugged in.*  
*Results on battery show similar relative differences.*

</FeatureSection>

## Setup

Clone the repository and install dependencies:

<pre><code>git clone <RepoCloneUrl />{"\n"}cd pithos{"\n"}pnpm install</code></pre>

:::tip[Interactive CLI]
Pithos includes an interactive CLI that lets you browse and run all benchmark and generation commands from a visual menu:

```bash
pnpm cli
```

Navigate with arrow keys, select a command, and run it directly.
:::

## Bundle Size

Measure any import manually with esbuild:

```bash
# Single function
echo 'import { chunk } from "pithos/arkhe/array/chunk"' | \
  esbuild --bundle --minify | gzip -c | wc -c

# Kanon schema
echo 'import { string, object, parse } from "pithos/kanon"' | \
  esbuild --bundle --minify | gzip -c | wc -c
```

Regenerate the full comparison data used in the bundle size comparison pages with these commands:

```bash
# Arkhe & Taphos bundle sizes
pnpm doc:generate-arkhe-taphos-bundle-sizes

# Kanon bundle sizes
cd packages/main/website
npx tsx scripts/generate-bundle-data.ts

# Zygos bundle sizes
pnpm doc:generate-zygos-bundle-sizes
```

## Performance Benchmarks

Run benchmarks per module:

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

## Environment

Results may vary depending on your hardware and Node.js version. Our published data is generated on a consistent environment to ensure fair comparisons across libraries.

---

<RelatedLinks title="See the Results">

- [Arkhe — Bundle Size](./arkhe/bundle-size.md) — Utility function sizes vs Lodash, es-toolkit, Remeda
- [Kanon — Performance](./kanon/performances.md) — Validation benchmarks vs Zod, Valibot, AJV
- [Taphos — Performance](./taphos/performances.md) — Deprecated utilities vs es-toolkit, Lodash
- [Zygos — Performance](./zygos/performances.md) — Result pattern benchmarks vs Neverthrow, fp-ts

</RelatedLinks>
