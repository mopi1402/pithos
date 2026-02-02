// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { reject as rejectCompatToolkit_ } from 'es-toolkit/compat';
import { reject as rejectLodashEs_ } from 'lodash-es';
import { reject as rejectTaphos_ } from '../../pithos/src/taphos/collection/reject';

const rejectCompatToolkit = rejectCompatToolkit_;
const rejectLodashEs = rejectLodashEs_;
const rejectTaphos = rejectTaphos_;

const arr = [
  { a: 0, b: true },
  { a: 1, b: true },
  { a: 0, b: false },
];

describe('reject', () => {
  bench('es-toolkit/compat/reject', () => {
    rejectCompatToolkit([1, 2, 3], number => number % 2 === 0);
    rejectCompatToolkit(arr, { b: true });
    rejectCompatToolkit(arr, ['a', 1]);
    rejectCompatToolkit(arr, items => items.b);
    rejectCompatToolkit({ a: 1, b: 2, c: 3 }, 'b');
  });

  bench('lodash-es/reject', () => {
    rejectLodashEs([1, 2, 3], number => number % 2 === 0);
    rejectLodashEs(arr, { b: true });
    rejectLodashEs(arr, ['a', 1]);
    rejectLodashEs(arr, items => items.b);
    rejectLodashEs({ a: 1, b: 2, c: 3 }, 'b');
  });

  bench('taphos/reject', () => {
    rejectTaphos([1, 2, 3], number => number % 2 === 0);
    rejectTaphos(arr, items => items.b);
  });

  bench('native/reject', () => {
    [1, 2, 3].filter(number => number % 2 !== 0);
    arr.filter(items => !items.b);
  });
});

describe('reject/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => ({ a: i, b: i % 2 === 0 }));

  bench('es-toolkit/compat/reject', () => {
    rejectCompatToolkit(largeArray, { b: true });
  });

  bench('lodash-es/reject', () => {
    rejectLodashEs(largeArray, { b: true });
  });

  bench('taphos/reject', () => {
    rejectTaphos(largeArray, item => item.b);
  });

  bench('native/reject', () => {
    largeArray.filter(item => !item.b);
  });
});
