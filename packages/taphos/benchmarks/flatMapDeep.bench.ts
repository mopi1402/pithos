// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { flatMapDeep as flatMapDeepToolkit_ } from 'es-toolkit';
import { flatMapDeep as flatMapDeepCompatToolkit_ } from 'es-toolkit/compat';
import { flatMapDeep as flatMapDeepLodashEs_ } from 'lodash-es';
import { flatMapDeep as flatMapDeepTaphos_ } from '../../pithos/src/taphos/collection/flatMapDeep';

const flatMapDeepToolkit = flatMapDeepToolkit_;
const flatMapDeepCompatToolkit = flatMapDeepCompatToolkit_;
const flatMapDeepLodashEs = flatMapDeepLodashEs_;
const flatMapDeepTaphos = flatMapDeepTaphos_;

function createNestedArray(arr: unknown[], depth: number): unknown[] {
  let result = arr;
  for (let i = 0; i < depth; i++) {
    result = [result];
  }
  return result;
}

describe('flatMapDeep', () => {
  const iterateeDepth = (item: number) => createNestedArray([item, item, item], 10);
  const arr = Array.from({ length: 30 }, (_, i) => i);

  bench('es-toolkit/flatMapDeep', () => {
    flatMapDeepToolkit(arr, iterateeDepth);
  });

  bench('es-toolkit/compat/flatMapDeep', () => {
    flatMapDeepCompatToolkit(arr, iterateeDepth);
  });

  bench('lodash-es/flatMapDeep', () => {
    flatMapDeepLodashEs(arr, iterateeDepth);
  });

  bench('taphos/flatMapDeep', () => {
    flatMapDeepTaphos(arr, iterateeDepth);
  });

  bench('native/flatMapDeep', () => {
    arr.flatMap(iterateeDepth).flat(Infinity);
  });
});
