// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { isNil as isNilToolkit_ } from 'es-toolkit';
import { isNil as isNilCompatToolkit_ } from 'es-toolkit/compat';
import { isNil as isNilLodashEs_ } from 'lodash-es';
import { isNil as isNilArkhe_ } from '../../pithos/src/arkhe/is/guard/is-nil';

const isNilToolkit = isNilToolkit_;
const isNilCompatToolkit = isNilCompatToolkit_;
const isNilLodashEs = isNilLodashEs_;
const isNilArkhe = isNilArkhe_;

describe('isNil', () => {
  bench('es-toolkit/isNil', () => {
    isNilToolkit(null);
        isNilToolkit(undefined);
        isNilToolkit(123);
        isNilToolkit([1, 2, 3]);
  });

  bench('es-toolkit/compat/isNil', () => {
    isNilCompatToolkit(null);
        isNilCompatToolkit(undefined);
        isNilCompatToolkit(123);
        isNilCompatToolkit([1, 2, 3]);
  });

  bench('lodash-es/isNil', () => {
    isNilLodashEs(null);
        isNilLodashEs(undefined);
        isNilLodashEs(123);
        isNilLodashEs([1, 2, 3]);
  });

  bench('arkhe/isNil', () => {
    isNilArkhe(null);
        isNilArkhe(undefined);
        isNilArkhe(123);
        isNilArkhe([1, 2, 3]);
  });
});
