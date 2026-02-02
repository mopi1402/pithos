// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { hasIn as hasInCompatToolkit_ } from 'es-toolkit/compat';
import { hasIn as hasInLodashEs_ } from 'lodash-es';
import { hasIn as hasInTaphos_ } from '../../pithos/src/taphos/object/hasIn';

const hasInCompatToolkit = hasInCompatToolkit_;
const hasInLodashEs = hasInLodashEs_;
const hasInTaphos = hasInTaphos_;

describe('hasIn', () => {
  const obj = { a: { b: 3 } };

  bench('es-toolkit/compat/hasIn', () => {
    hasInCompatToolkit(obj, 'a.b');
  });

  bench('lodash-es/hasIn', () => {
    hasInLodashEs(obj, 'a.b');
  });

  bench('taphos/hasIn', () => {
    hasInTaphos(obj, 'a.b');
  });

  // Note: native 'in' only checks direct keys, not paths
  bench('native/hasIn', () => {
    'a' in obj;
  });
});

describe('hasIn/deepPath', () => {
  const deepObj = { a: { b: { c: { d: { e: { f: 1 } } } } } };

  bench('es-toolkit/compat/hasIn', () => {
    hasInCompatToolkit(deepObj, 'a.b.c.d.e.f');
  });

  bench('lodash-es/hasIn', () => {
    hasInLodashEs(deepObj, 'a.b.c.d.e.f');
  });

  bench('taphos/hasIn', () => {
    hasInTaphos(deepObj, 'a.b.c.d.e.f');
  });

  // Note: native 'in' only checks direct keys, not paths
  bench('native/hasIn', () => {
    'a' in deepObj;
  });
});
