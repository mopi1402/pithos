// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { flatten as flattenToolkit_ } from 'es-toolkit';
import { flatten as flattenCompatToolkit_ } from 'es-toolkit/compat';
import { flattenDepth as flattenDepthLodashEs_ } from 'lodash-es';
import { flatten as flattenTaphos_ } from '../../pithos/src/taphos/array/flatten';

const flattenToolkit = flattenToolkit_;
const flattenCompatToolkit = flattenCompatToolkit_;
const flattenDepthLodashEs = flattenDepthLodashEs_;
const flattenTaphos = flattenTaphos_;

const createNestedArray = (values: unknown[]): unknown[] => {
  if (values.length === 0) {
    return [];
  }
  const [first, ...rest] = values;
  return [first, createNestedArray(rest)];
};

describe('flatten', () => {
  const arr = createNestedArray(Array.from({ length: 30 }, (_, index) => index));

  bench('es-toolkit/flatten', () => {
    flattenToolkit(arr, 30);
  });

  bench('es-toolkit/flatten (compat)', () => {
    flattenCompatToolkit(arr);
  });

  bench('lodash-es/flattenDepth', () => {
    flattenDepthLodashEs(arr, 30);
  });

  bench('taphos/flatten', () => {
    flattenTaphos(arr);
  });

  bench('native/flatten', () => {
    arr.flat();
  });
});
