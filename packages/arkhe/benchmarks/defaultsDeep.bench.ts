// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { defaultsDeep as defaultsDeepCompatToolkit_ } from 'es-toolkit/compat';
import { defaultsDeep as defaultsDeepLodashEs_ } from 'lodash-es';
import { defaultsDeep as defaultsDeepArkhe_ } from '../../pithos/src/arkhe/object/defaults-deep';

const defaultsDeepCompatToolkit = defaultsDeepCompatToolkit_;
const defaultsDeepLodashEs = defaultsDeepLodashEs_;
const defaultsDeepArkhe = defaultsDeepArkhe_;

describe('defaultsDeep', () => {
  bench('es-toolkit/compat/defaultsDeep', () => {
    defaultsDeepCompatToolkit({ a: 1 }, { a: 2, b: 2 });
        defaultsDeepCompatToolkit({ a: 1, b: 2 }, { b: 3 }, { c: 3 });
  });

  bench('lodash-es/defaultsDeep', () => {
    defaultsDeepLodashEs({ a: 1 }, { a: 2, b: 2 });
        defaultsDeepLodashEs({ a: 1, b: 2 }, { b: 3 }, { c: 3 });
  });

  bench('arkhe/defaultsDeep', () => {
    defaultsDeepArkhe({ a: 1 }, { a: 2, b: 2 });
        defaultsDeepArkhe({ a: 1, b: 2 }, { b: 3 }, { c: 3 });
  });
});
