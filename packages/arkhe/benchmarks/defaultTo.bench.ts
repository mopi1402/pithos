// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { defaultTo as defaultToCompatToolkit_ } from 'es-toolkit/compat';
import { defaultTo as defaultToLodashEs_ } from 'lodash-es';
import { defaultTo as defaultToArkhe_ } from '../../pithos/src/arkhe/util/default-to';

const defaultToCompatToolkit = defaultToCompatToolkit_;
const defaultToLodashEs = defaultToLodashEs_;
const defaultToArkhe = defaultToArkhe_;

describe('defaultTo', () => {
  bench('es-toolkit/compat/defaultTo', () => {
    defaultToCompatToolkit(null, 123);
        defaultToCompatToolkit(undefined, '64');
        defaultToCompatToolkit(NaN, 0);
        defaultToCompatToolkit(true, 0);
        defaultToCompatToolkit(123, 0);
  });

  bench('lodash-es/defaultTo', () => {
    defaultToLodashEs(null, 123);
        defaultToLodashEs(undefined, '64');
        defaultToLodashEs(NaN, 0);
        defaultToLodashEs(true, 0);
        defaultToLodashEs(123, 0);
  });

  bench('arkhe/defaultTo', () => {
    defaultToArkhe(null, 123);
        defaultToArkhe(undefined, '64');
        defaultToArkhe(NaN, 0);
        defaultToArkhe(true, 0);
        defaultToArkhe(123, 0);
  });
});
