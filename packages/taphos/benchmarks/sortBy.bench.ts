// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
// Note: taphos sortBy only supports a single iteratee function, not arrays of keys/functions
import { bench, describe } from 'vitest';
import { sortBy as sortByToolkit_ } from 'es-toolkit';
import { sortBy as sortByCompatToolkit_ } from 'es-toolkit/compat';
import { sortBy as sortByLodashEs_ } from 'lodash-es';
import { sortBy as sortByTaphos_ } from '../../pithos/src/taphos/collection/sortBy';

const sortByToolkit = sortByToolkit_;
const sortByCompatToolkit = sortByCompatToolkit_;
const sortByLodashEs = sortByLodashEs_;
const sortByTaphos = sortByTaphos_;

const users = [
  { user: 'fred', age: 48, nested: { user: 'fred' } },
  { user: 'barney', age: 34, nested: { user: 'barney' } },
  { user: 'fred', age: 40, nested: { user: 'fred' } },
  { user: 'barney', age: 36, nested: { user: 'bar' } },
];

describe('sortBy', () => {
  bench('es-toolkit/sortBy', () => {
    sortByToolkit(users, ['user', 'age']);
    sortByToolkit(users, [user => user.user, user => user.age]);
  });

  bench('es-toolkit/compat/sortBy', () => {
    sortByCompatToolkit(users, ['user', 'age']);
    sortByCompatToolkit(users, [user => user.user, user => user.age]);
  });

  bench('lodash-es/sortBy', () => {
    sortByLodashEs(users, ['user', 'age']);
    sortByLodashEs(users, [user => user.user, user => user.age]);
  });

  bench('taphos/sortBy', () => {
    sortByTaphos(users, user => user.user);
    sortByTaphos(users, user => user.age);
  });

  bench('native/sortBy', () => {
    [...users].sort((a, b) => a.user.localeCompare(b.user));
    [...users].sort((a, b) => a.age - b.age);
  });
});

describe('sortBy/nestedPropertyNames', () => {
  bench('es-toolkit/compat/sortBy', () => {
    sortByCompatToolkit(users, [['nested', 'user'], ['age']]);
  });

  bench('lodash-es/sortBy', () => {
    sortByLodashEs(users, [['nested', 'user'], ['age']]);
  });

  // Note: taphos sortBy does not support nested property path arrays
});

describe('sortBy/propertyPath', () => {
  bench('es-toolkit/compat/sortBy', () => {
    sortByCompatToolkit(users, ['nested.user', 'age']);
  });

  bench('lodash-es/sortBy', () => {
    sortByLodashEs(users, ['nested.user', 'age']);
  });

  // Note: taphos sortBy does not support property path strings
});
