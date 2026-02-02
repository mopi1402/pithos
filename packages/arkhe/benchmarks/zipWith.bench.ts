// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { zipWith as zipWithToolkit_ } from 'es-toolkit';
import { zipWith as zipWithCompatToolkit_ } from 'es-toolkit/compat';
import { zipWith as zipWithLodashEs_ } from 'lodash-es';
import { zipWith as zipWithArkhe_ } from '../../pithos/src/arkhe/array/zip-with';

const zipWithToolkit = zipWithToolkit_;
const zipWithCompatToolkit = zipWithCompatToolkit_;
const zipWithLodashEs = zipWithLodashEs_;
const zipWithArkhe = zipWithArkhe_;

describe('zipWith', () => {
  const arr1 = [1, 2];
  const arr2 = [3, 4];
  const arr3 = [5, 6];

  bench('es-toolkit/zipWith', () => {
    zipWithToolkit(arr1, arr2, arr3, (a, b, c) => `${a}${b}${c}`);
  });

  bench('es-toolkit/compat/zipWith', () => {
    zipWithCompatToolkit(arr1, arr2, arr3, (a, b, c) => `${a}${b}${c}`);
  });

  bench('lodash-es/zipWith', () => {
    zipWithLodashEs(arr1, arr2, arr3, (a, b, c) => `${a}${b}${c}`);
  });

  bench('arkhe/zipWith', () => {
    zipWithArkhe([arr1, arr2, arr3], (a, b, c) => `${a}${b}${c}`);
  });
});

describe('zipWith/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);

  bench('es-toolkit/zipWith', () => {
    zipWithToolkit(largeArray, largeArray, largeArray, (a, b, c) => a + b + c);
  });

  bench('es-toolkit/compat/zipWith', () => {
    zipWithCompatToolkit(largeArray, largeArray, largeArray, (a, b, c) => a + b + c);
  });

  bench('lodash-es/zipWith', () => {
    zipWithLodashEs(largeArray, largeArray, largeArray, (a, b, c) => a + b + c);
  });

  bench('arkhe/zipWith', () => {
    zipWithArkhe([largeArray, largeArray, largeArray], (a, b, c) => a + b + c);
  });
});
