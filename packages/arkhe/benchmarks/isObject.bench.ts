// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { isObject as isObjectCompatToolkit_ } from 'es-toolkit/compat';
import { isObject as isObjectLodashEs_ } from 'lodash-es';
import { isObject as isObjectArkhe_ } from '../../pithos/src/arkhe/is/guard/is-object';

const isObjectCompatToolkit = isObjectCompatToolkit_;
const isObjectLodashEs = isObjectLodashEs_;
const isObjectArkhe = isObjectArkhe_;

describe('isObject', () => {
  bench('es-toolkit/compat/isObject', () => {
    isObjectCompatToolkit([1, 2, 3]);
        isObjectCompatToolkit(true);
        isObjectCompatToolkit(new Date());
        isObjectCompatToolkit(new Error());
        isObjectCompatToolkit(1);
        isObjectCompatToolkit(/x/);
        isObjectCompatToolkit('a');
        isObjectCompatToolkit(Array.prototype.slice);
  });

  bench('lodash-es/isObject', () => {
    isObjectLodashEs([1, 2, 3]);
        isObjectLodashEs(true);
        isObjectLodashEs(new Date());
        isObjectLodashEs(new Error());
        isObjectLodashEs(1);
        isObjectLodashEs(/x/);
        isObjectLodashEs('a');
        isObjectLodashEs(Array.prototype.slice);
  });

  bench('arkhe/isObject', () => {
    isObjectArkhe([1, 2, 3]);
        isObjectArkhe(true);
        isObjectArkhe(new Date());
        isObjectArkhe(new Error());
        isObjectArkhe(1);
        isObjectArkhe(/x/);
        isObjectArkhe('a');
        isObjectArkhe(Array.prototype.slice);
  });
});
