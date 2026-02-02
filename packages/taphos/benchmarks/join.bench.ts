// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { join as joinCompatToolkit_ } from 'es-toolkit/compat';
import { join as joinLodashEs_ } from 'lodash-es';
import { join as joinTaphos_ } from '../../pithos/src/taphos/array/join';

const joinCompatToolkit = joinCompatToolkit_;
const joinLodashEs = joinLodashEs_;
const joinTaphos = joinTaphos_;

describe('join', () => {
  const arr = [1, 2, 3];

  bench('es-toolkit/compat/join', () => {
    joinCompatToolkit(arr, ',');
  });

  bench('lodash-es/join', () => {
    joinLodashEs(arr, ',');
  });

  bench('taphos/join', () => {
    joinTaphos(arr, ',');
  });

  bench('native/join', () => {
    arr.join(',');
  });
});

describe('join/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);

  bench('es-toolkit/compat/join', () => {
    joinCompatToolkit(largeArray, ',');
  });

  bench('lodash-es/join', () => {
    joinLodashEs(largeArray, ',');
  });

  bench('taphos/join', () => {
    joinTaphos(largeArray, ',');
  });

  bench('native/join', () => {
    largeArray.join(',');
  });
});
