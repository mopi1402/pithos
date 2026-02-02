// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
// Note: taphos has two different `at` functions:
// - taphos/array/at: returns element at index (like Array.at())
// - taphos/object/at: returns values at paths (like lodash at)
import { bench, describe } from 'vitest';
import { at as atCompatToolkit_ } from 'es-toolkit/compat';
import { at as atLodashEs_ } from 'lodash-es';
import { at as atTaphosObject_ } from '../../pithos/src/taphos/object/at';
import { at as atTaphosArray_ } from '../../pithos/src/taphos/array/at';

const atCompatToolkit = atCompatToolkit_;
const atLodashEs = atLodashEs_;
const atTaphosObject = atTaphosObject_;
const atTaphosArray = atTaphosArray_;

describe('at/object', () => {
  const data = { a: 1, b: { c: 2 }, d: [3, 4] };
  const paths = ['a', 'b.c', 'd[0]'];

  bench('es-toolkit/compat/at', () => {
    atCompatToolkit(data, paths);
  });

  bench('lodash-es/at', () => {
    atLodashEs(data, paths);
  });

  bench('taphos/object/at', () => {
    atTaphosObject(data, paths);
  });

  // Note: No simple native equivalent for object path access
});

describe('at/arrayByIndex', () => {
  const data = ['a', 'b', 'c', 'd', 'e'];

  // Note: taphos/array/at works like Array.at() - single index access
  bench('es-toolkit/compat/at', () => {
    atCompatToolkit(data, [0, 2, 4]);
  });

  bench('lodash-es/at', () => {
    atLodashEs(data, [0, 2, 4]);
  });

  bench('taphos/array/at', () => {
    atTaphosArray(data, 0);
    atTaphosArray(data, 2);
    atTaphosArray(data, 4);
  });

  bench('native/at', () => {
    data[0];
    data[2];
    data[4];
  });
});
