// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { findKey as findKeyToolkit_ } from 'es-toolkit';
import { findKey as findKeyCompatToolkit_ } from 'es-toolkit/compat';
import { findKey as findKeyLodashEs_ } from 'lodash-es';
import { findKey as findKeyArkhe_ } from '../../pithos/src/arkhe/object/find-key';

const findKeyToolkit = findKeyToolkit_;
const findKeyCompatToolkit = findKeyCompatToolkit_;
const findKeyLodashEs = findKeyLodashEs_;
const findKeyArkhe = findKeyArkhe_;

describe('findKey', () => {
  const users = {
    pebbles: { age: 24, active: true },
    barney: { age: 36, active: true },
    fred: { age: 40, active: false },
  };

  bench('es-toolkit/findKey', () => {
    findKeyToolkit(users, o => o.age < 40);
  });

  bench('es-toolkit/compat/findKey', () => {
    findKeyCompatToolkit(users, o => o.age < 40);
  });

  bench('lodash-es/findKey', () => {
    findKeyLodashEs(users, o => o.age < 40);
  });

  bench('arkhe/findKey', () => {
    findKeyArkhe(users, o => o.age < 40);
  });
});

describe('findKey/largeObject', () => {
  const largeUsers: Record<string, { age: number }> = {};
  for (let i = 0; i < 10000; i++) {
    largeUsers[`user${i}`] = { age: i };
  }

  bench('es-toolkit/findKey', () => {
    findKeyToolkit(largeUsers, o => o.age === 7000);
  });

  bench('es-toolkit/compat/findKey', () => {
    findKeyCompatToolkit(largeUsers, o => o.age === 7000);
  });

  bench('lodash-es/findKey', () => {
    findKeyLodashEs(largeUsers, o => o.age === 7000);
  });

  bench('arkhe/findKey', () => {
    findKeyArkhe(largeUsers, o => o.age === 7000);
  });
});
