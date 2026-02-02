// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { filter as filterCompatToolkit_ } from 'es-toolkit/compat';
import { filter as filterLodashEs_ } from 'lodash-es';
import { filter as filterTaphos_ } from '../../pithos/src/taphos/collection/filter';

const filterCompatToolkit = filterCompatToolkit_;
const filterLodashEs = filterLodashEs_;
const filterTaphos = filterTaphos_;

const arr = [
  { a: 0, b: true },
  { a: 1, b: true },
  { a: 0, b: false },
];

describe('filter', () => {
  bench('es-toolkit/compat/filter', () => {
    filterCompatToolkit([1, 2, 3], number => number % 2 === 0);
    filterCompatToolkit(arr, { b: true });
    filterCompatToolkit(arr, ['a', 1]);
    filterCompatToolkit(arr, items => items.b);
    filterCompatToolkit({ a: 1, b: 2, c: 3 }, 'b');
  });

  bench('lodash-es/filter', () => {
    filterLodashEs([1, 2, 3], number => number % 2 === 0);
    filterLodashEs(arr, { b: true });
    filterLodashEs(arr, ['a', 1]);
    filterLodashEs(arr, items => items.b);
    filterLodashEs({ a: 1, b: 2, c: 3 }, 'b');
  });

  bench('taphos/filter', () => {
    filterTaphos([1, 2, 3], number => number % 2 === 0);
    filterTaphos(arr, items => items.b);
  });

  bench('native/filter', () => {
    [1, 2, 3].filter(number => number % 2 === 0);
    arr.filter(items => items.b);
  });
});

describe('filter/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => ({ a: i, b: i % 2 === 0 }));

  bench('es-toolkit/compat/filter', () => {
    filterCompatToolkit(largeArray, { b: true });
  });

  bench('lodash-es/filter', () => {
    filterLodashEs(largeArray, { b: true });
  });

  bench('taphos/filter', () => {
    filterTaphos(largeArray, item => item.b);
  });

  bench('native/filter', () => {
    largeArray.filter(item => item.b);
  });
});
