// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { find as findCompatToolkit_ } from 'es-toolkit/compat';
import { find as findLodashEs_ } from 'lodash-es';
import { find as findTaphos_ } from '../../pithos/src/taphos/array/find';

const findCompatToolkit = findCompatToolkit_;
const findLodashEs = findLodashEs_;
const findTaphos = findTaphos_;

const items = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

describe('find', () => {
  // Note: taphos find only supports predicate functions, not shorthand notations
  bench('es-toolkit/compat/find', () => {
    findCompatToolkit(items, x => x.name === 'Bob');
    findCompatToolkit(items, { name: 'Bob' });
    findCompatToolkit(items, ['name', 'Bob']);
    findCompatToolkit(items, 'name');
  });

  bench('lodash-es/find', () => {
    findLodashEs(items, x => x.name === 'Bob');
    findLodashEs(items, { name: 'Bob' });
    findLodashEs(items, ['name', 'Bob']);
    findLodashEs(items, 'name');
  });

  bench('taphos/find', () => {
    findTaphos(items, x => x.name === 'Bob');
    findTaphos(items, x => x.name === 'Bob');
    findTaphos(items, x => x.name === 'Bob');
    findTaphos(items, x => Boolean(x.name));
  });

  bench('native/find', () => {
    items.find(x => x.name === 'Bob');
    items.find(x => x.name === 'Bob');
    items.find(x => x.name === 'Bob');
    items.find(x => Boolean(x.name));
  });
});

describe('find/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Name ${i}` }));

  bench('es-toolkit/compat/find', () => {
    findCompatToolkit(largeArray, x => x.name === 'Name 5000');
  });

  bench('lodash-es/find', () => {
    findLodashEs(largeArray, x => x.name === 'Name 5000');
  });

  bench('taphos/find', () => {
    findTaphos(largeArray, x => x.name === 'Name 5000');
  });

  bench('native/find', () => {
    largeArray.find(x => x.name === 'Name 5000');
  });
});
