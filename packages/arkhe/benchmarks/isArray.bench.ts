// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { isArray as isArrayCompatToolkit_ } from 'es-toolkit/compat';
import { isArray as isArrayLodashEs_ } from 'lodash-es';
import { isArray as isArrayArkhe_ } from '../../pithos/src/arkhe/is/guard/is-array';

const isArrayCompatToolkit = isArrayCompatToolkit_;
const isArrayLodashEs = isArrayLodashEs_;
const isArrayArkhe = isArrayArkhe_;

describe('isArray', () => {
  bench('es-toolkit/compat/isArray', () => {
    isArrayCompatToolkit([1, 2, 3]);
        isArrayCompatToolkit('abc');
        isArrayCompatToolkit(() => {});
  });

  bench('lodash-es/isArray', () => {
    isArrayLodashEs([1, 2, 3]);
        isArrayLodashEs('abc');
        isArrayLodashEs(() => {});
  });

  bench('arkhe/isArray', () => {
    isArrayArkhe([1, 2, 3]);
        isArrayArkhe('abc');
        isArrayArkhe(() => {});
  });
});
