// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { flattenDepth as flattenDepthCompatToolkit_ } from 'es-toolkit/compat';
import { flattenDepth as flattenDepthLodashEs_ } from 'lodash-es';
import { flattenDepth as flattenDepthTaphos_ } from '../../pithos/src/taphos/array/flattenDepth';

const flattenDepthCompatToolkit = flattenDepthCompatToolkit_;
const flattenDepthLodashEs = flattenDepthLodashEs_;
const flattenDepthTaphos = flattenDepthTaphos_;

describe('flattenDepth', () => {
  const arr = [1, [2, 3], [4, [5, 6]]];

  bench('es-toolkit/compat/flattenDepth', () => {
    flattenDepthCompatToolkit(arr, 2);
  });

  bench('lodash-es/flattenDepth', () => {
    flattenDepthLodashEs(arr, 2);
  });

  bench('taphos/flattenDepth', () => {
    flattenDepthTaphos(arr, 2);
  });

  bench('native/flattenDepth', () => {
    arr.flat(2);
  });
});
