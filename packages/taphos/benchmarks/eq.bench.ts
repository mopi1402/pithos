// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { eq as eqCompatToolkit_ } from 'es-toolkit/compat';
import { eq as eqLodashEs_ } from 'lodash-es';
import { eq as eqTaphos_ } from '../../pithos/src/taphos/lang/eq';

const eqCompatToolkit = eqCompatToolkit_;
const eqLodashEs = eqLodashEs_;
const eqTaphos = eqTaphos_;

describe('eq', () => {
  bench('es-toolkit/compat/eq', () => {
    eqCompatToolkit(NaN, NaN);
    eqCompatToolkit(NaN, 0);
    eqCompatToolkit(0, NaN);
    eqCompatToolkit(0, -0);
    eqCompatToolkit('abc', 'abc');
  });

  bench('lodash-es/eq', () => {
    eqLodashEs(NaN, NaN);
    eqLodashEs(NaN, 0);
    eqLodashEs(0, NaN);
    eqLodashEs(0, -0);
    eqLodashEs('abc', 'abc');
  });

  bench('taphos/eq', () => {
    eqTaphos(NaN, NaN);
    eqTaphos(NaN, 0);
    eqTaphos(0, NaN);
    eqTaphos(0, -0);
    eqTaphos('abc', 'abc');
  });

  bench('native/eq', () => {
    Object.is(NaN, NaN);
    Object.is(NaN, 0);
    Object.is(0, NaN);
    Object.is(0, -0);
    Object.is('abc', 'abc');
  });
});
