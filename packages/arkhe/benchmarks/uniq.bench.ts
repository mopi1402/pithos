// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
// Note: arkhe doesn't have a simple uniq, using uniqBy with identity
import { bench, describe } from 'vitest';
import { uniq as uniqToolkit_ } from 'es-toolkit';
import { uniq as uniqCompatToolkit_ } from 'es-toolkit/compat';
import { uniq as uniqLodashEs_ } from 'lodash-es';
import { uniqBy as uniqByArkhe_ } from '../../pithos/src/arkhe/array/uniq-by';

const uniqToolkit = uniqToolkit_;
const uniqCompatToolkit = uniqCompatToolkit_;
const uniqLodashEs = uniqLodashEs_;
const uniqByArkhe = uniqByArkhe_;
const identity = <T>(x: T) => x;

describe('uniq', () => {
  bench('es-toolkit/uniq', () => {
    uniqToolkit([11, 2, 3, 44, 11, 2, 3]);
  });

  bench('es-toolkit/compat/uniq', () => {
    uniqCompatToolkit([11, 2, 3, 44, 11, 2, 3]);
  });

  bench('lodash-es/uniq', () => {
    uniqLodashEs([11, 2, 3, 44, 11, 2, 3]);
  });

  bench('arkhe/uniqBy (identity)', () => {
    uniqByArkhe([11, 2, 3, 44, 11, 2, 3], identity);
  });
});

describe('uniq/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i % 1000);

  bench('es-toolkit/uniq', () => {
    uniqToolkit(largeArray);
  });

  bench('es-toolkit/compat/uniq', () => {
    uniqCompatToolkit(largeArray);
  });

  bench('lodash-es/uniq', () => {
    uniqLodashEs(largeArray);
  });

  bench('arkhe/uniqBy (identity)', () => {
    uniqByArkhe(largeArray, identity);
  });
});
