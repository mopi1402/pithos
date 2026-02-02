// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { isFunction as isFunctionToolkit_ } from 'es-toolkit';
import { isFunction as isFunctionCompatToolkit_ } from 'es-toolkit/compat';
import { isFunction as isFunctionLodashEs_ } from 'lodash-es';
import { isFunction as isFunctionArkhe_ } from '../../pithos/src/arkhe/is/guard/is-function';

const isFunctionToolkit = isFunctionToolkit_;
const isFunctionCompatToolkit = isFunctionCompatToolkit_;
const isFunctionLodashEs = isFunctionLodashEs_;
const isFunctionArkhe = isFunctionArkhe_;

describe('isFunction', () => {
  bench('es-toolkit/isFunction', () => {
    isFunctionToolkit(true);
        isFunctionToolkit(new Date());
        isFunctionToolkit(new Error());
        isFunctionToolkit({ a: 1 });
        isFunctionToolkit(1);
        isFunctionToolkit(/x/);
        isFunctionToolkit(Array.from({ length: 10000 }));
        isFunctionToolkit(async () => {});
        isFunctionToolkit(function* () {});
        isFunctionToolkit(Proxy);
        isFunctionToolkit(Int8Array);
        isFunctionToolkit(() => {});
        isFunctionToolkit(Array.prototype.slice);
  });

  bench('es-toolkit/compat/isFunction', () => {
    isFunctionCompatToolkit(true);
        isFunctionCompatToolkit(new Date());
        isFunctionCompatToolkit(new Error());
        isFunctionCompatToolkit({ a: 1 });
        isFunctionCompatToolkit(1);
        isFunctionCompatToolkit(/x/);
        isFunctionCompatToolkit(Array.from({ length: 10000 }));
        isFunctionCompatToolkit(async () => {});
        isFunctionCompatToolkit(function* () {});
        isFunctionCompatToolkit(Proxy);
        isFunctionCompatToolkit(Int8Array);
        isFunctionCompatToolkit(() => {});
        isFunctionCompatToolkit(Array.prototype.slice);
  });

  bench('lodash-es/isFunction', () => {
    isFunctionLodashEs(true);
        isFunctionLodashEs(new Date());
        isFunctionLodashEs(new Error());
        isFunctionLodashEs({ a: 1 });
        isFunctionLodashEs(1);
        isFunctionLodashEs(/x/);
        isFunctionLodashEs(Array.from({ length: 10000 }));
        isFunctionLodashEs(async () => {});
        isFunctionLodashEs(function* () {});
        isFunctionLodashEs(Proxy);
        isFunctionLodashEs(Int8Array);
        isFunctionLodashEs(() => {});
        isFunctionLodashEs(Array.prototype.slice);
  });

  bench('arkhe/isFunction', () => {
    isFunctionArkhe(true);
        isFunctionArkhe(new Date());
        isFunctionArkhe(new Error());
        isFunctionArkhe({ a: 1 });
        isFunctionArkhe(1);
        isFunctionArkhe(/x/);
        isFunctionArkhe(Array.from({ length: 10000 }));
        isFunctionArkhe(async () => {});
        isFunctionArkhe(function* () {});
        isFunctionArkhe(Proxy);
        isFunctionArkhe(Int8Array);
        isFunctionArkhe(() => {});
        isFunctionArkhe(Array.prototype.slice);
  });
});
