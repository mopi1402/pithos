// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { create as createCompatToolkit_ } from 'es-toolkit/compat';
import { create as createLodashEs_ } from 'lodash-es';
import { create as createTaphos_ } from '../../pithos/src/taphos/object/create';

const createCompatToolkit = createCompatToolkit_;
const createLodashEs = createLodashEs_;
const createTaphos = createTaphos_;

describe('create', () => {
  bench('es-toolkit/compat/create', () => {
    createCompatToolkit({ a: 1 }, { b: 2 });
  });

  bench('lodash-es/create', () => {
    createLodashEs({ a: 1 }, { b: 2 });
  });

  bench('taphos/create', () => {
    createTaphos({ a: 1 }, { b: 2 });
  });

  bench('native/create', () => {
    Object.assign(Object.create({ a: 1 }), { b: 2 });
  });
});
