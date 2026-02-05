// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { uniq as uniqToolkit_ } from 'es-toolkit';
import { uniq as uniqCompatToolkit_ } from 'es-toolkit/compat';
import { uniq as uniqLodashEs_ } from 'lodash-es';
import { uniq as uniqArkhe_ } from '../../pithos/src/arkhe/array/uniq';

const uniqToolkit = uniqToolkit_;
const uniqCompatToolkit = uniqCompatToolkit_;
const uniqLodashEs = uniqLodashEs_;
const uniqArkhe = uniqArkhe_;

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

  bench('arkhe/uniq', () => {
    uniqArkhe([11, 2, 3, 44, 11, 2, 3]);
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

  bench('arkhe/uniq', () => {
    uniqArkhe(largeArray);
  });
});
