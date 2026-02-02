// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { isBoolean as isBooleanToolkit_ } from 'es-toolkit';
import { isBoolean as isBooleanCompatToolkit_ } from 'es-toolkit/compat';
import { isBoolean as isBooleanLodashEs_ } from 'lodash-es';
import { isBoolean as isBooleanArkhe_ } from '../../pithos/src/arkhe/is/guard/is-boolean';

const isBooleanToolkit = isBooleanToolkit_;
const isBooleanCompatToolkit = isBooleanCompatToolkit_;
const isBooleanLodashEs = isBooleanLodashEs_;
const isBooleanArkhe = isBooleanArkhe_;

describe('isBoolean', () => {
  bench('es-toolkit/isBoolean', () => {
    isBooleanToolkit(true);
        isBooleanToolkit(false);
        isBooleanToolkit(undefined);
        isBooleanToolkit('');
        isBooleanToolkit(123);
        isBooleanToolkit({});
        isBooleanToolkit(Boolean());
  });

  bench('es-toolkit/compat/isBoolean', () => {
    isBooleanCompatToolkit(true);
        isBooleanCompatToolkit(false);
        isBooleanCompatToolkit(undefined);
        isBooleanCompatToolkit('');
        isBooleanCompatToolkit(123);
        isBooleanCompatToolkit({});
        isBooleanCompatToolkit(Boolean());
  });

  bench('lodash-es/isBoolean', () => {
    isBooleanLodashEs(true);
        isBooleanLodashEs(false);
        isBooleanLodashEs(undefined);
        isBooleanLodashEs('');
        isBooleanLodashEs(123);
        isBooleanLodashEs({});
        isBooleanLodashEs(Boolean());
  });

  bench('arkhe/isBoolean', () => {
    isBooleanArkhe(true);
        isBooleanArkhe(false);
        isBooleanArkhe(undefined);
        isBooleanArkhe('');
        isBooleanArkhe(123);
        isBooleanArkhe({});
        isBooleanArkhe(Boolean());
  });
});
