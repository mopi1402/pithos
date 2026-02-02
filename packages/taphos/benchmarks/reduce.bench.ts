// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { reduce as reduceCompatToolkit_ } from 'es-toolkit/compat';
import { reduce as reduceLodashEs_ } from 'lodash-es';
import { reduce as reduceTaphos_ } from '../../pithos/src/taphos/collection/reduce';

const reduceCompatToolkit = reduceCompatToolkit_;
const reduceLodashEs = reduceLodashEs_;
const reduceTaphos = reduceTaphos_;

const array = [1, 2, 3, 4, 5];

describe('reduce', () => {
  bench('es-toolkit/compat/reduce', () => {
    reduceCompatToolkit(array, (acc, x) => acc + x, 0);
  });

  bench('lodash-es/reduce', () => {
    reduceLodashEs(array, (acc, x) => acc + x, 0);
  });

  bench('taphos/reduce', () => {
    reduceTaphos(array, (acc, x) => acc + x, 0);
  });

  bench('native/reduce', () => {
    array.reduce((acc, x) => acc + x, 0);
  });
});

describe('reduce/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);

  bench('es-toolkit/compat/reduce', () => {
    reduceCompatToolkit(largeArray, (acc, x) => acc + x, 0);
  });

  bench('lodash-es/reduce', () => {
    reduceLodashEs(largeArray, (acc, x) => acc + x, 0);
  });

  bench('taphos/reduce', () => {
    reduceTaphos(largeArray, (acc, x) => acc + x, 0);
  });

  bench('native/reduce', () => {
    largeArray.reduce((acc, x) => acc + x, 0);
  });
});
