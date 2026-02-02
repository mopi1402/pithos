// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { isRegExp as isRegExpToolkit_ } from 'es-toolkit';
import { isRegExp as isRegExpCompatToolkit_ } from 'es-toolkit/compat';
import { isRegExp as isRegExpLodashEs_ } from 'lodash-es';
import { isRegExp as isRegExpArkhe_ } from '../../pithos/src/arkhe/is/guard/is-regexp';

const isRegExpToolkit = isRegExpToolkit_;
const isRegExpCompatToolkit = isRegExpCompatToolkit_;
const isRegExpLodashEs = isRegExpLodashEs_;
const isRegExpArkhe = isRegExpArkhe_;

describe('isRegExp', () => {
  bench('es-toolkit/isRegExp', () => {
    isRegExpToolkit(new RegExp(''));
        isRegExpToolkit(/abc/);
        isRegExpToolkit('/abc/');
  });

  bench('es-toolkit/compat/isRegExp', () => {
    isRegExpCompatToolkit(new RegExp(''));
        isRegExpCompatToolkit(/abc/);
        isRegExpCompatToolkit('/abc/');
  });

  bench('lodash-es/isRegExp', () => {
    isRegExpLodashEs(new RegExp(''));
        isRegExpLodashEs(/abc/);
        isRegExpLodashEs('/abc/');
  });

  bench('arkhe/isRegExp', () => {
    isRegExpArkhe(new RegExp(''));
        isRegExpArkhe(/abc/);
        isRegExpArkhe('/abc/');
  });
});
