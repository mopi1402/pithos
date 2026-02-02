// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { findLastIndex as findLastIndexCompatToolkit_ } from 'es-toolkit/compat';
import { findLastIndex as findLastIndexLodashEs_ } from 'lodash-es';
import { findLastIndex as findLastIndexArkhe_ } from '../../pithos/src/arkhe/array/find-last-index';

const findLastIndexCompatToolkit = findLastIndexCompatToolkit_;
const findLastIndexLodashEs = findLastIndexLodashEs_;
const findLastIndexArkhe = findLastIndexArkhe_;

const items = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 35 },
];

describe('findLastIndex', () => {
  bench('es-toolkit/compat/findLastIndex', () => {
    findLastIndexCompatToolkit(items, x => x.name === 'Bob');
  });

  bench('lodash-es/findLastIndex', () => {
    findLastIndexLodashEs(items, x => x.name === 'Bob');
  });

  bench('arkhe/findLastIndex', () => {
    findLastIndexArkhe(items, x => x.name === 'Bob');
  });
});

describe('findLastIndex/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Name ${i}` }));

  bench('es-toolkit/compat/findLastIndex', () => {
    findLastIndexCompatToolkit(largeArray, x => x.name === 'Name 5000');
  });

  bench('lodash-es/findLastIndex', () => {
    findLastIndexLodashEs(largeArray, x => x.name === 'Name 5000');
  });

  bench('arkhe/findLastIndex', () => {
    findLastIndexArkhe(largeArray, x => x.name === 'Name 5000');
  });
});
