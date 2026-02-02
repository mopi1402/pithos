// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { has as hasCompatToolkit_ } from 'es-toolkit/compat';
import { has as hasLodashEs_ } from 'lodash-es';
import { has as hasArkhe_ } from '../../pithos/src/arkhe/object/has';

const hasCompatToolkit = hasCompatToolkit_;
const hasLodashEs = hasLodashEs_;
const hasArkhe = hasArkhe_;

describe('has', () => {
  bench('es-toolkit/compat/has', () => {
    hasCompatToolkit({ a: { b: 3 } }, 'a');
  });

  bench('lodash-es/has', () => {
    hasLodashEs({ a: { b: 3 } }, 'a');
  });

  bench('arkhe/has', () => {
    hasArkhe({ a: { b: 3 } }, 'a');
  });
});

describe('has/nested', () => {
  const obj = { a: { b: { c: 3 } } };

  bench('es-toolkit/compat/has', () => {
    hasCompatToolkit(obj, 'a.b.c');
  });

  bench('lodash-es/has', () => {
    hasLodashEs(obj, 'a.b.c');
  });

  bench('arkhe/has', () => {
    hasArkhe(obj, 'a.b.c');
  });
});
