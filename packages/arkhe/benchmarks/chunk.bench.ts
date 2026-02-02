// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { chunk as chunkToolkit_ } from 'es-toolkit';
import { chunk as chunkCompatToolkit_ } from 'es-toolkit/compat';
import { chunk as chunkLodashEs_ } from 'lodash-es';
import { chunk as chunkArkhe_ } from '../../pithos/src/arkhe/array/chunk';

const chunkToolkit = chunkToolkit_;
const chunkCompatToolkit = chunkCompatToolkit_;
const chunkLodashEs = chunkLodashEs_;
const chunkArkhe = chunkArkhe_;

describe('chunk', () => {
  bench('es-toolkit/chunk', () => {
    chunkToolkit([1, 2, 3, 4, 5, 6], 3);
  });

  bench('es-toolkit/compat/chunk', () => {
    chunkCompatToolkit([1, 2, 3, 4, 5, 6], 3);
  });

  bench('lodash-es/chunk', () => {
    chunkLodashEs([1, 2, 3, 4, 5, 6], 3);
  });

  bench('arkhe/chunk', () => {
    chunkArkhe([1, 2, 3, 4, 5, 6], 3);
  });
});

describe('chunk/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);

  bench('es-toolkit/chunk', () => {
    chunkToolkit(largeArray, 100);
  });

  bench('es-toolkit/compat/chunk', () => {
    chunkCompatToolkit(largeArray, 100);
  });

  bench('lodash-es/chunk', () => {
    chunkLodashEs(largeArray, 100);
  });

  bench('arkhe/chunk', () => {
    chunkArkhe(largeArray, 100);
  });
});
