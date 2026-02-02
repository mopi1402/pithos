// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { flatMapDepth as flatMapDepthCompatToolkit_ } from 'es-toolkit/compat';
import { flatMapDepth as flatMapDepthLodashEs_ } from 'lodash-es';
import { flatMapDepth as flatMapDepthTaphos_ } from '../../pithos/src/taphos/collection/flatMapDepth';

const flatMapDepthCompatToolkit = flatMapDepthCompatToolkit_;
const flatMapDepthLodashEs = flatMapDepthLodashEs_;
const flatMapDepthTaphos = flatMapDepthTaphos_;

function createNestedArray(arr: unknown[], depth: number): unknown[] {
  let result = arr;
  for (let i = 0; i < depth; i++) {
    result = [result];
  }
  return result;
}

describe('flatMapDepth', () => {
  const iterateeDepth = (item: number) => createNestedArray([item, item, item], 10);
  const arr = Array.from({ length: 30 }, (_, i) => i);

  bench('es-toolkit/compat/flatMapDepth', () => {
    flatMapDepthCompatToolkit(arr, iterateeDepth, 100);
  });

  bench('lodash-es/flatMapDepth', () => {
    flatMapDepthLodashEs(arr, iterateeDepth, 100);
  });

  bench('taphos/flatMapDepth', () => {
    flatMapDepthTaphos(arr, iterateeDepth, 100);
  });

  bench('native/flatMapDepth', () => {
    arr.flatMap(iterateeDepth).flat(100);
  });
});
