/**
 * Display name mappings for arkhe bundle size comparison libraries.
 * Extracted from arkhe/BundleSizeTable/index.tsx for data/presentation separation.
 */

import { translate } from '@docusaurus/Translate';

export const libraryNames: Record<string, string> = {
  pithos: translate({ id: 'comparison.bundle.arkhe.lib.pithos', message: 'Pithos' }),
  lodash: translate({ id: 'comparison.bundle.arkhe.lib.lodash', message: 'Lodash' }),
  "es-toolkit": translate({ id: 'comparison.bundle.arkhe.lib.esToolkit', message: 'es-toolkit' }),
  "es-toolkit/compat": translate({ id: 'comparison.bundle.arkhe.lib.esToolkitCompat', message: 'es-toolkit/compat' }),
  remeda: translate({ id: 'comparison.bundle.arkhe.lib.remeda', message: 'Remeda' }),
  radashi: translate({ id: 'comparison.bundle.arkhe.lib.radashi', message: 'Radashi' }),
};
