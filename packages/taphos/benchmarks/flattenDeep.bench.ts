// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { flattenDeep as flattenDeepToolkit_ } from 'es-toolkit';
import { flattenDeep as flattenDeepCompatToolkit_ } from 'es-toolkit/compat';
import { flattenDeep as flattenDeepLodashEs_ } from 'lodash-es';
import { flattenDeep as flattenDeepTaphos_ } from '../../pithos/src/taphos/array/flattenDeep';

const flattenDeepToolkit = flattenDeepToolkit_;
const flattenDeepCompatToolkit = flattenDeepCompatToolkit_;
const flattenDeepLodashEs = flattenDeepLodashEs_;
const flattenDeepTaphos = flattenDeepTaphos_;

const createNestedArray = (values: unknown[]): unknown[] => {
  if (values.length === 0) {
    return [];
  }
  const [first, ...rest] = values;
  return [first, createNestedArray(rest)];
};

describe('flattenDeep', () => {
  const arr = createNestedArray(Array.from({ length: 30 }, (_, index) => index));

  bench('es-toolkit/flattenDeep', () => {
    flattenDeepToolkit(arr);
  });

  bench('es-toolkit/compat/flattenDeep', () => {
    flattenDeepCompatToolkit(arr);
  });

  bench('lodash-es/flattenDeep', () => {
    flattenDeepLodashEs(arr);
  });

  bench('taphos/flattenDeep', () => {
    flattenDeepTaphos(arr);
  });

  bench('native/flattenDeep', () => {
    arr.flat(Infinity);
  });
});
