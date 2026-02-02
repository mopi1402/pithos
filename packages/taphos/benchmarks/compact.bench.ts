// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { compact as compactToolkit_ } from 'es-toolkit';
import { compact as compactCompatToolkit_ } from 'es-toolkit/compat';
import { compact as compactLodashEs_ } from 'lodash-es';
import { compact as compactTaphos_ } from '../../pithos/src/taphos/array/compact';

const compactToolkit = compactToolkit_;
const compactCompatToolkit = compactCompatToolkit_;
const compactLodashEs = compactLodashEs_;
const compactTaphos = compactTaphos_;

describe('compact', () => {
  bench('es-toolkit/compact', () => {
    compactToolkit([0, 1, false, 2, '', 3, null, undefined, 4, NaN, 5]);
  });

  bench('es-toolkit/compat/compact', () => {
    compactCompatToolkit([0, 1, false, 2, '', 3, null, undefined, 4, NaN, 5]);
  });

  bench('lodash-es/compact', () => {
    compactLodashEs([0, 1, false, 2, '', 3, null, undefined, 4, NaN, 5]);
  });

  bench('taphos/compact', () => {
    compactTaphos([0, 1, false, 2, '', 3, null, undefined, 4, NaN, 5]);
  });

  bench('native/compact', () => {
    [0, 1, false, 2, '', 3, null, undefined, 4, NaN, 5].filter(Boolean);
  });
});

describe('compact/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => (i % 10 === 0 ? undefined : i));

  bench('es-toolkit/compact', () => {
    compactToolkit(largeArray);
  });

  bench('es-toolkit/compat/compact', () => {
    compactCompatToolkit(largeArray);
  });

  bench('lodash-es/compact', () => {
    compactLodashEs(largeArray);
  });

  bench('taphos/compact', () => {
    compactTaphos(largeArray);
  });

  bench('native/compact', () => {
    largeArray.filter(Boolean);
  });
});
