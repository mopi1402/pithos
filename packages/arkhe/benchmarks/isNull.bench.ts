// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { isNull as isNullToolkit_ } from 'es-toolkit';
import { isNull as isNullCompatToolkit_ } from 'es-toolkit/compat';
import { isNull as isNullLodashEs_ } from 'lodash-es';
import { isNull as isNullArkhe_ } from '../../pithos/src/arkhe/is/guard/is-null';

const isNullToolkit = isNullToolkit_;
const isNullCompatToolkit = isNullCompatToolkit_;
const isNullLodashEs = isNullLodashEs_;
const isNullArkhe = isNullArkhe_;

describe('isNull', () => {
  bench('es-toolkit/isNull', () => {
    isNullToolkit(null);
        isNullToolkit(undefined);
        isNullToolkit('');
        isNullToolkit(123);
  });

  bench('es-toolkit/compat/isNull', () => {
    isNullCompatToolkit(null);
        isNullCompatToolkit(undefined);
        isNullCompatToolkit('');
        isNullCompatToolkit(123);
  });

  bench('lodash-es/isNull', () => {
    isNullLodashEs(null);
        isNullLodashEs(undefined);
        isNullLodashEs('');
        isNullLodashEs(123);
  });

  bench('arkhe/isNull', () => {
    isNullArkhe(null);
        isNullArkhe(undefined);
        isNullArkhe('');
        isNullArkhe(123);
  });
});
