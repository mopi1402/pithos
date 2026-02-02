// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { isNumber as isNumberCompatToolkit_ } from 'es-toolkit/compat';
import { isNumber as isNumberLodashEs_ } from 'lodash-es';
import { isNumber as isNumberArkhe_ } from '../../pithos/src/arkhe/is/guard/is-number';

const isNumberCompatToolkit = isNumberCompatToolkit_;
const isNumberLodashEs = isNumberLodashEs_;
const isNumberArkhe = isNumberArkhe_;

describe('isNumber', () => {
  bench('es-toolkit/compat/isNumber', () => {
    isNumberCompatToolkit(1);
        isNumberCompatToolkit(1.5);
        isNumberCompatToolkit(NaN);
        isNumberCompatToolkit(Infinity);
        isNumberCompatToolkit('1');
        isNumberCompatToolkit(true);
        isNumberCompatToolkit(null);
        isNumberCompatToolkit(undefined);
        isNumberCompatToolkit({});
        isNumberCompatToolkit([]);
  });

  bench('lodash-es/isNumber', () => {
    isNumberLodashEs(1);
        isNumberLodashEs(1.5);
        isNumberLodashEs(NaN);
        isNumberLodashEs(Infinity);
        isNumberLodashEs('1');
        isNumberLodashEs(true);
        isNumberLodashEs(null);
        isNumberLodashEs(undefined);
        isNumberLodashEs({});
        isNumberLodashEs([]);
  });

  bench('arkhe/isNumber', () => {
    isNumberArkhe(1);
        isNumberArkhe(1.5);
        isNumberArkhe(NaN);
        isNumberArkhe(Infinity);
        isNumberArkhe('1');
        isNumberArkhe(true);
        isNumberArkhe(null);
        isNumberArkhe(undefined);
        isNumberArkhe({});
        isNumberArkhe([]);
  });
});
