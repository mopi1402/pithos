// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { assign as assignCompatToolkit_ } from 'es-toolkit/compat';
import { assign as assignLodashEs_ } from 'lodash-es';
import { assign as assignTaphos_ } from '../../pithos/src/taphos/object/assign';

const assignCompatToolkit = assignCompatToolkit_;
const assignLodashEs = assignLodashEs_;
const assignTaphos = assignTaphos_;

describe('assign', () => {
  bench('es-toolkit/compat/assign', () => {
    assignCompatToolkit({ a: 1 }, { b: 2 }, { c: 3 }, { a: 4 });
  });

  bench('lodash-es/assign', () => {
    assignLodashEs({ a: 1 }, { b: 2 }, { c: 3 }, { a: 4 });
  });

  bench('taphos/assign', () => {
    assignTaphos({ a: 1 }, { b: 2 }, { c: 3 }, { a: 4 });
  });

  bench('native/assign', () => {
    Object.assign({ a: 1 }, { b: 2 }, { c: 3 }, { a: 4 });
  });
});
