// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { castArray as castArrayCompatToolkit_ } from 'es-toolkit/compat';
import { castArray as castArrayLodashEs_ } from 'lodash-es';
import { castArray as castArrayTaphos_ } from '../../pithos/src/taphos/util/castArray';

const castArrayCompatToolkit = castArrayCompatToolkit_;
const castArrayLodashEs = castArrayLodashEs_;
const castArrayTaphos = castArrayTaphos_;

describe('castArray', () => {
  bench('es-toolkit/compat/castArray', () => {
    castArrayCompatToolkit(1);
    castArrayCompatToolkit([1]);
  });

  bench('lodash-es/castArray', () => {
    castArrayLodashEs(1);
    castArrayLodashEs([1]);
  });

  bench('taphos/castArray', () => {
    castArrayTaphos(1);
    castArrayTaphos([1]);
  });

  bench('native/castArray', () => {
    const v1 = 1;
    Array.isArray(v1) ? v1 : [v1];
    const v2 = [1];
    Array.isArray(v2) ? v2 : [v2];
  });
});
