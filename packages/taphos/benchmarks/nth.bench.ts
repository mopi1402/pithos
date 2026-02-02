// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { nth as nthCompatToolkit_ } from 'es-toolkit/compat';
import { nth as nthLodashEs_ } from 'lodash-es';
import { nth as nthTaphos_ } from '../../pithos/src/taphos/array/nth';

const nthCompatToolkit = nthCompatToolkit_;
const nthLodashEs = nthLodashEs_;
const nthTaphos = nthTaphos_;

describe('nth', () => {
  const array = [1, 2, 3];

  bench('es-toolkit/compat/nth', () => {
    nthCompatToolkit(array, 1);
    nthCompatToolkit(array, -1);
  });

  bench('lodash-es/nth', () => {
    nthLodashEs(array, 1);
    nthLodashEs(array, -1);
  });

  bench('taphos/nth', () => {
    nthTaphos(array, 1);
    nthTaphos(array, -1);
  });

  bench('native/nth', () => {
    array[1];
    array[array.length - 1];
  });
});

describe('nth/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);

  bench('es-toolkit/compat/nth', () => {
    nthCompatToolkit(largeArray, 1);
    nthCompatToolkit(largeArray, -1);
  });

  bench('lodash-es/nth', () => {
    nthLodashEs(largeArray, 1);
    nthLodashEs(largeArray, -1);
  });

  bench('taphos/nth', () => {
    nthTaphos(largeArray, 1);
    nthTaphos(largeArray, -1);
  });

  bench('native/nth', () => {
    largeArray[1];
    largeArray[largeArray.length - 1];
  });
});
