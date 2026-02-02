// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { isSet as isSetToolkit_ } from 'es-toolkit';
import { isSet as isSetCompatToolkit_ } from 'es-toolkit/compat';
import { isSet as isSetLodashEs_ } from 'lodash-es';
import { isSet as isSetArkhe_ } from '../../pithos/src/arkhe/is/guard/is-set';

const isSetToolkit = isSetToolkit_;
const isSetCompatToolkit = isSetCompatToolkit_;
const isSetLodashEs = isSetLodashEs_;
const isSetArkhe = isSetArkhe_;

describe('isSet', () => {
  bench('es-toolkit/isSet', () => {
    isSetToolkit(new Set());
        isSetToolkit(new WeakSet());
        isSetToolkit([]);
        isSetToolkit({});
        isSetToolkit(null);
  });

  bench('es-toolkit/compat/isSet', () => {
    isSetCompatToolkit(new Set());
        isSetCompatToolkit(new WeakSet());
        isSetCompatToolkit([]);
        isSetCompatToolkit({});
        isSetCompatToolkit(null);
  });

  bench('lodash-es/isSet', () => {
    isSetLodashEs(new Set());
        isSetLodashEs(new WeakSet());
        isSetLodashEs([]);
        isSetLodashEs({});
        isSetLodashEs(null);
  });

  bench('arkhe/isSet', () => {
    isSetArkhe(new Set());
        isSetArkhe(new WeakSet());
        isSetArkhe([]);
        isSetArkhe({});
        isSetArkhe(null);
  });
});
