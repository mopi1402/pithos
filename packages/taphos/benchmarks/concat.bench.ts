// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { concat as concatCompatToolkit_ } from 'es-toolkit/compat';
import { concat as concatLodashEs_ } from 'lodash-es';
import { concat as concatTaphos_ } from '../../pithos/src/taphos/array/concat';

const concatCompatToolkit = concatCompatToolkit_;
const concatLodashEs = concatLodashEs_;
const concatTaphos = concatTaphos_;

describe('concat', () => {
  const arr = [1, [2, 3]];

  bench('es-toolkit/compat/concat', () => {
    concatCompatToolkit(arr, 4);
  });

  bench('lodash-es/concat', () => {
    concatLodashEs(arr, 4);
  });

  bench('taphos/concat', () => {
    concatTaphos(arr, 4);
  });

  bench('native/concat', () => {
    arr.concat(4);
  });
});

describe('concat/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);

  bench('es-toolkit/compat/concat', () => {
    concatCompatToolkit(largeArray, largeArray);
  });

  bench('lodash-es/concat', () => {
    concatLodashEs(largeArray, largeArray);
  });

  bench('taphos/concat', () => {
    concatTaphos(largeArray, largeArray);
  });

  bench('native/concat', () => {
    largeArray.concat(largeArray);
  });
});
