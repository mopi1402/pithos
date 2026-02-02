// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { findLast as findLastCompatToolkit_ } from 'es-toolkit/compat';
import { findLast as findLastLodashEs_ } from 'lodash-es';
import { findLast as findLastArkhe_ } from '../../pithos/src/arkhe/array/find-last';

const findLastCompatToolkit = findLastCompatToolkit_;
const findLastLodashEs = findLastLodashEs_;
const findLastArkhe = findLastArkhe_;

const items = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 35 },
];

describe('findLast', () => {
  bench('es-toolkit/compat/findLast', () => {
    findLastCompatToolkit(items, x => x.name === 'Bob');
  });

  bench('lodash-es/findLast', () => {
    findLastLodashEs(items, x => x.name === 'Bob');
  });

  bench('arkhe/findLast', () => {
    findLastArkhe(items, x => x.name === 'Bob');
  });
});

describe('findLast/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Name ${i}` }));

  bench('es-toolkit/compat/findLast', () => {
    findLastCompatToolkit(largeArray, x => x.name === 'Name 5000');
  });

  bench('lodash-es/findLast', () => {
    findLastLodashEs(largeArray, x => x.name === 'Name 5000');
  });

  bench('arkhe/findLast', () => {
    findLastArkhe(largeArray, x => x.name === 'Name 5000');
  });
});
