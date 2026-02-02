// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { isPlainObject as isPlainObjectToolkit_ } from 'es-toolkit';
import { isPlainObject as isPlainObjectCompatToolkit_ } from 'es-toolkit/compat';
import { isPlainObject as isPlainObjectLodashEs_ } from 'lodash-es';
import { isPlainObject as isPlainObjectArkhe_ } from '../../pithos/src/arkhe/is/guard/is-plain-object';

const isPlainObjectToolkit = isPlainObjectToolkit_;
const isPlainObjectCompatToolkit = isPlainObjectCompatToolkit_;
const isPlainObjectLodashEs = isPlainObjectLodashEs_;
const isPlainObjectArkhe = isPlainObjectArkhe_;

const object = { a: 1, b: 2 };

describe('isPlainObject', () => {
  bench('es-toolkit/isPlainObject', () => {
    isPlainObjectToolkit({});
    isPlainObjectToolkit([]);
    isPlainObjectToolkit(null);
    isPlainObjectToolkit(object);
  });

  bench('es-toolkit/compat/isPlainObject', () => {
    isPlainObjectCompatToolkit({});
    isPlainObjectCompatToolkit([]);
    isPlainObjectCompatToolkit(null);
    isPlainObjectCompatToolkit(object);
  });

  bench('lodash-es/isPlainObject', () => {
    isPlainObjectLodashEs({});
    isPlainObjectLodashEs([]);
    isPlainObjectLodashEs(null);
    isPlainObjectLodashEs(object);
  });

  bench('arkhe/isPlainObject', () => {
    isPlainObjectArkhe({});
    isPlainObjectArkhe([]);
    isPlainObjectArkhe(null);
    isPlainObjectArkhe(object);
  });
});
