// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { pullAllWith as pullAllWithCompatToolkit_ } from 'es-toolkit/compat';
import { pullAllWith as pullAllWithLodashEs_ } from 'lodash-es';
import { pullAllWith as pullAllWithTaphos_ } from '../../pithos/src/taphos/array/pullAllWith';

const pullAllWithCompatToolkit = pullAllWithCompatToolkit_;
const pullAllWithLodashEs = pullAllWithLodashEs_;
const pullAllWithTaphos = pullAllWithTaphos_;

describe('pullAllWith', () => {
  const array = [{ x: 1 }, { x: 2 }, { x: 3 }, { x: 4 }, { x: 5 }];
  const valuesToRemove = [{ x: 2 }, { x: 4 }];
  const comparator = (a: { x: number }, b: { x: number }) => a.x === b.x;

  bench('es-toolkit/compat/pullAllWith', () => {
    pullAllWithCompatToolkit([...array], valuesToRemove, comparator);
  });

  bench('lodash-es/pullAllWith', () => {
    pullAllWithLodashEs([...array], valuesToRemove, comparator);
  });

  bench('taphos/pullAllWith', () => {
    pullAllWithTaphos([...array], valuesToRemove, comparator);
  });

  bench('native/pullAllWith', () => {
    // Native immutable approach using differenceWith pattern
    [...array].filter(a => !valuesToRemove.some(b => comparator(a, b)));
  });
});

describe('pullAllWith/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => ({ x: i }));
  const valuesToRemove = Array.from({ length: 1000 }, (_, i) => ({ x: i + 1000 }));
  const comparator = (a: { x: number }, b: { x: number }) => a.x === b.x;

  bench('es-toolkit/compat/pullAllWith', () => {
    pullAllWithCompatToolkit([...largeArray], valuesToRemove, comparator);
  });

  bench('lodash-es/pullAllWith', () => {
    pullAllWithLodashEs([...largeArray], valuesToRemove, comparator);
  });

  bench('taphos/pullAllWith', () => {
    pullAllWithTaphos([...largeArray], valuesToRemove, comparator);
  });

  bench('native/pullAllWith', () => {
    [...largeArray].filter(a => !valuesToRemove.some(b => comparator(a, b)));
  });
});
