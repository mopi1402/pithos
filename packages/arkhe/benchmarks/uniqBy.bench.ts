// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { uniqBy as uniqByToolkit_ } from 'es-toolkit';
import { uniqBy as uniqByCompatToolkit_ } from 'es-toolkit/compat';
import { uniqBy as uniqByLodashEs_ } from 'lodash-es';
import { uniqBy as uniqByArkhe_ } from '../../pithos/src/arkhe/array/uniq-by';

const uniqByToolkit = uniqByToolkit_;
const uniqByCompatToolkit = uniqByCompatToolkit_;
const uniqByLodashEs = uniqByLodashEs_;
const uniqByArkhe = uniqByArkhe_;

describe('uniqBy/smallArrays', () => {
  bench('es-toolkit/uniqBy', () => {
    uniqByToolkit([2.1, 1.2, 2.3], Math.floor);
  });

  bench('es-toolkit/compat/uniqBy', () => {
    uniqByCompatToolkit([2.1, 1.2, 2.3], Math.floor);
  });

  bench('lodash-es/uniqBy', () => {
    uniqByLodashEs([2.1, 1.2, 2.3], Math.floor);
  });

  bench('arkhe/uniqBy', () => {
    uniqByArkhe([2.1, 1.2, 2.3], Math.floor);
  });
});

describe('uniqBy/largeArrays', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i % 1000 + Math.random());

  bench('es-toolkit/uniqBy', () => {
    uniqByToolkit(largeArray, Math.floor);
  });

  bench('es-toolkit/compat/uniqBy', () => {
    uniqByCompatToolkit(largeArray, Math.floor);
  });

  bench('lodash-es/uniqBy', () => {
    uniqByLodashEs(largeArray, Math.floor);
  });

  bench('arkhe/uniqBy', () => {
    uniqByArkhe(largeArray, Math.floor);
  });
});
