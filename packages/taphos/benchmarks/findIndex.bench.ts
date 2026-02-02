// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { findIndex as findIndexCompatToolkit_ } from 'es-toolkit/compat';
import { findIndex as findIndexLodashEs_ } from 'lodash-es';
import { findIndex as findIndexTaphos_ } from '../../pithos/src/taphos/array/findIndex';

const findIndexCompatToolkit = findIndexCompatToolkit_;
const findIndexLodashEs = findIndexLodashEs_;
const findIndexTaphos = findIndexTaphos_;

const items = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

describe('findIndex', () => {
  bench('es-toolkit/compat/findIndex', () => {
    findIndexCompatToolkit(items, x => x.name === 'Bob');
    findIndexCompatToolkit(items, { name: 'Bob' });
    findIndexCompatToolkit(items, ['name', 'Bob']);
    findIndexCompatToolkit(items, 'name');
  });

  bench('lodash-es/findIndex', () => {
    findIndexLodashEs(items, x => x.name === 'Bob');
    findIndexLodashEs(items, { name: 'Bob' });
    findIndexLodashEs(items, ['name', 'Bob']);
    findIndexLodashEs(items, 'name');
  });

  bench('taphos/findIndex', () => {
    findIndexTaphos(items, x => x.name === 'Bob');
  });

  bench('native/findIndex', () => {
    items.findIndex(x => x.name === 'Bob');
  });
});

describe('findIndex/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Name ${i}` }));

  bench('es-toolkit/compat/findIndex', () => {
    findIndexCompatToolkit(largeArray, x => x.name === 'Name 5000');
  });

  bench('lodash-es/findIndex', () => {
    findIndexLodashEs(largeArray, x => x.name === 'Name 5000');
  });

  bench('taphos/findIndex', () => {
    findIndexTaphos(largeArray, x => x.name === 'Name 5000');
  });

  bench('native/findIndex', () => {
    largeArray.findIndex(x => x.name === 'Name 5000');
  });
});
