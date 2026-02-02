// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { unset as unsetCompatToolkit_ } from 'es-toolkit/compat';
import { unset as unsetLodashEs_ } from 'lodash-es';
import { unset as unsetTaphos_ } from '../../pithos/src/taphos/object/unset';

const unsetCompatToolkit = unsetCompatToolkit_;
const unsetLodashEs = unsetLodashEs_;
const unsetTaphos = unsetTaphos_;

describe('unset', () => {
  bench('es-toolkit/compat/unset', () => {
    const object = { a: { b: { c: null } } };
        unsetCompatToolkit(object, 'a.b.c');
  });

  bench('lodash-es/unset', () => {
    const object = { a: { b: { c: null } } };
        unsetLodashEs(object, 'a.b.c');
  });

  bench('taphos/unset', () => {
    const object = { a: { b: { c: null } } };
        unsetTaphos(object, 'a.b.c');
  });

  // Note: No simple native equivalent for deep path unset
  // Use destructuring for shallow properties or libraries like immer
});
