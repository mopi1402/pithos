// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { get as getCompatToolkit_ } from 'es-toolkit/compat';
import { get as getLodashEs_ } from 'lodash-es';
import { get as getArkhe_ } from '../../pithos/src/arkhe/object/get';

const getCompatToolkit = getCompatToolkit_;
const getLodashEs = getLodashEs_;
const getArkhe = getArkhe_;

describe('get/simple', () => {
  bench('es-toolkit/compat/get', () => {
    getCompatToolkit({ a: 1, b: 2 }, 'a');
  });

  bench('lodash-es/get', () => {
    getLodashEs({ a: 1, b: 2 }, 'a');
  });

  bench('arkhe/get', () => {
    getArkhe({ a: 1, b: 2 }, 'a');
  });
});

describe('get/nested', () => {
  bench('es-toolkit/compat/get', () => {
    getCompatToolkit({ a: { b: 3 } }, 'a.b');
  });

  bench('lodash-es/get', () => {
    getLodashEs({ a: { b: 3 } }, 'a.b');
  });

  bench('arkhe/get', () => {
    getArkhe({ a: { b: 3 } }, 'a.b');
  });
});

describe('get/arrayPath', () => {
  bench('es-toolkit/compat/get', () => {
    getCompatToolkit({ a: { b: 3 } }, ['a', 'b']);
  });

  bench('lodash-es/get', () => {
    getLodashEs({ a: { b: 3 } }, ['a', 'b']);
  });

  bench('arkhe/get', () => {
    getArkhe({ a: { b: 3 } }, ['a', 'b']);
  });
});
