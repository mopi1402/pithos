// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { isUndefined as isUndefinedToolkit_ } from 'es-toolkit';
import { isUndefined as isUndefinedCompatToolkit_ } from 'es-toolkit/compat';
import { isUndefined as isUndefinedLodashEs_ } from 'lodash-es';
import { isUndefined as isUndefinedArkhe_ } from '../../pithos/src/arkhe/is/guard/is-undefined';

const isUndefinedToolkit = isUndefinedToolkit_;
const isUndefinedCompatToolkit = isUndefinedCompatToolkit_;
const isUndefinedLodashEs = isUndefinedLodashEs_;
const isUndefinedArkhe = isUndefinedArkhe_;

describe('isUndefined', () => {
  bench('es-toolkit/isUndefined', () => {
    isUndefinedToolkit(undefined);
        isUndefinedToolkit(null);
        isUndefinedToolkit('');
        isUndefinedToolkit(123);
  });

  bench('es-toolkit/compat/isUndefined', () => {
    isUndefinedCompatToolkit(undefined);
        isUndefinedCompatToolkit(null);
        isUndefinedCompatToolkit('');
        isUndefinedCompatToolkit(123);
  });

  bench('lodash-es/isUndefined', () => {
    isUndefinedLodashEs(undefined);
        isUndefinedLodashEs(null);
        isUndefinedLodashEs('');
        isUndefinedLodashEs(123);
  });

  bench('arkhe/isUndefined', () => {
    isUndefinedArkhe(undefined);
        isUndefinedArkhe(null);
        isUndefinedArkhe('');
        isUndefinedArkhe(123);
  });
});
