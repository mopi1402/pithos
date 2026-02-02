// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { fromPairs as fromPairsCompatToolkit_ } from 'es-toolkit/compat';
import { fromPairs as fromPairsLodashEs_ } from 'lodash-es';
import { fromPairs as fromPairsTaphos_ } from '../../pithos/src/taphos/array/fromPairs';

const fromPairsCompatToolkit = fromPairsCompatToolkit_;
const fromPairsLodashEs = fromPairsLodashEs_;
const fromPairsTaphos = fromPairsTaphos_;

describe('fromPairs', () => {
  const data: [string, number][] = [
    ['a', 1],
    ['b', 2],
    ['c', 3],
  ];

  bench('es-toolkit/compat/fromPairs', () => {
    fromPairsCompatToolkit(data);
  });

  bench('lodash-es/fromPairs', () => {
    fromPairsLodashEs(data);
  });

  bench('taphos/fromPairs', () => {
    fromPairsTaphos(data);
  });

  bench('native/fromPairs', () => {
    Object.fromEntries(data);
  });
});

describe('fromPairs/largeArray', () => {
  const largeArray: [number, number][] = Array.from({ length: 10000 }, (_, i) => [i, i]);

  bench('es-toolkit/compat/fromPairs', () => {
    fromPairsCompatToolkit(largeArray);
  });

  bench('lodash-es/fromPairs', () => {
    fromPairsLodashEs(largeArray);
  });

  bench('taphos/fromPairs', () => {
    fromPairsTaphos(largeArray);
  });

  bench('native/fromPairs', () => {
    Object.fromEntries(largeArray);
  });
});
