// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { takeRightWhile as takeRightWhileToolkit_ } from 'es-toolkit';
import { takeRightWhile as takeRightWhileCompatToolkit_ } from 'es-toolkit/compat';
import { takeRightWhile as takeRightWhileLodashEs_ } from 'lodash-es';
import { takeRightWhile as takeRightWhileArkhe_ } from '../../pithos/src/arkhe/array/take-right-while';

const takeRightWhileToolkit = takeRightWhileToolkit_;
const takeRightWhileCompatToolkit = takeRightWhileCompatToolkit_;
const takeRightWhileLodashEs = takeRightWhileLodashEs_;
const takeRightWhileArkhe = takeRightWhileArkhe_;

describe('takeRightWhile', () => {
  bench('es-toolkit/takeRightWhile', () => {
    takeRightWhileToolkit([5, 4, 3, 2, 1], n => n < 4);
  });

  bench('es-toolkit/compat/takeRightWhile', () => {
    takeRightWhileCompatToolkit([5, 4, 3, 2, 1], n => n < 4);
  });

  bench('lodash-es/takeRightWhile', () => {
    takeRightWhileLodashEs([5, 4, 3, 2, 1], n => n < 4);
  });

  bench('arkhe/takeRightWhile', () => {
    takeRightWhileArkhe([5, 4, 3, 2, 1], n => n < 4);
  });
});

describe('takeRightWhile/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);

  bench('es-toolkit/takeRightWhile', () => {
    takeRightWhileToolkit(largeArray, n => n < 100);
  });

  bench('es-toolkit/compat/takeRightWhile', () => {
    takeRightWhileCompatToolkit(largeArray, n => n < 100);
  });

  bench('lodash-es/takeRightWhile', () => {
    takeRightWhileLodashEs(largeArray, n => n < 100);
  });

  bench('arkhe/takeRightWhile', () => {
    takeRightWhileArkhe(largeArray, n => n < 100);
  });
});
