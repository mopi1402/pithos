// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { isString as isStringToolkit_ } from 'es-toolkit';
import { isString as isStringCompatToolkit_ } from 'es-toolkit/compat';
import { isString as isStringLodashEs_ } from 'lodash-es';
import { isString as isStringArkhe_ } from '../../pithos/src/arkhe/is/guard/is-string';

const isStringToolkit = isStringToolkit_;
const isStringCompatToolkit = isStringCompatToolkit_;
const isStringLodashEs = isStringLodashEs_;
const isStringArkhe = isStringArkhe_;

describe('isString', () => {
  bench('es-toolkit/isString', () => {
    isStringToolkit('');
        isStringToolkit(true);
        isStringToolkit(undefined);
        isStringToolkit(123);
        isStringToolkit(String(''));
        isStringToolkit(Object(''));
  });

  bench('es-toolkit/compat/isString', () => {
    isStringCompatToolkit('');
        isStringCompatToolkit(true);
        isStringCompatToolkit(undefined);
        isStringCompatToolkit(123);
        isStringCompatToolkit(String(''));
        isStringCompatToolkit(Object(''));
  });

  bench('lodash-es/isString', () => {
    isStringLodashEs('');
        isStringLodashEs(true);
        isStringLodashEs(undefined);
        isStringLodashEs(123);
        isStringLodashEs(String(''));
        isStringLodashEs(Object(''));
  });

  bench('arkhe/isString', () => {
    isStringArkhe('');
        isStringArkhe(true);
        isStringArkhe(undefined);
        isStringArkhe(123);
        isStringArkhe(String(''));
        isStringArkhe(Object(''));
  });
});
