// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { update as updateCompatToolkit_ } from 'es-toolkit/compat';
import { update as updateLodashEs_ } from 'lodash-es';
import { update as updateTaphos_ } from '../../pithos/src/taphos/object/update';

const updateCompatToolkit = updateCompatToolkit_;
const updateLodashEs = updateLodashEs_;
const updateTaphos = updateTaphos_;

describe('update/dotNotation', () => {
  const obj = { a: { b: { c: 3 } } };

  bench('es-toolkit/compat/update', () => {
    updateCompatToolkit(obj, 'a.b.c', value => (value as number) + 1);
  });

  bench('lodash-es/update', () => {
    updateLodashEs(obj, 'a.b.c', value => (value as number) + 1);
  });

  bench('taphos/update', () => {
    updateTaphos(obj, 'a.b.c', value => (value as number) + 1);
  });

  // Note: No simple native equivalent for deep path update
  // Use spread operator for shallow updates or libraries like immer
});

describe('update/arrayNotation', () => {
  const obj = { a: [{ b: { c: 3 } }] };

  bench('es-toolkit/compat/update', () => {
    updateCompatToolkit(obj, 'a[0].b.c', value => (value as number) + 1);
  });

  bench('lodash-es/update', () => {
    updateLodashEs(obj, 'a[0].b.c', value => (value as number) + 1);
  });

  bench('taphos/update', () => {
    updateTaphos(obj, 'a[0].b.c', value => (value as number) + 1);
  });
});

describe('update/deepPathCreation', () => {
  const obj = {};

  bench('es-toolkit/compat/update', () => {
    updateCompatToolkit(obj, 'a.b.c.d.e', () => 'value');
  });

  bench('lodash-es/update', () => {
    updateLodashEs(obj, 'a.b.c.d.e', () => 'value');
  });

  bench('taphos/update', () => {
    updateTaphos(obj, 'a.b.c.d.e', () => 'value');
  });
});
