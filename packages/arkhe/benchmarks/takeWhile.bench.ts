// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { takeWhile as takeWhileToolkit_ } from 'es-toolkit';
import { takeWhile as takeWhileCompatToolkit_ } from 'es-toolkit/compat';
import { takeWhile as takeWhileLodashEs_ } from 'lodash-es';
import { takeWhile as takeWhileArkhe_ } from '../../pithos/src/arkhe/array/take-while';

const takeWhileToolkit = takeWhileToolkit_;
const takeWhileCompatToolkit = takeWhileCompatToolkit_;
const takeWhileLodashEs = takeWhileLodashEs_;
const takeWhileArkhe = takeWhileArkhe_;

describe('takeWhile', () => {
  bench('es-toolkit/takeWhile', () => {
    takeWhileToolkit([5, 4, 3, 2, 1], n => n < 4);
  });

  bench('es-toolkit/compat/takeWhile', () => {
    takeWhileCompatToolkit([5, 4, 3, 2, 1], n => n < 4);
  });

  bench('lodash-es/takeWhile', () => {
    takeWhileLodashEs([5, 4, 3, 2, 1], n => n < 4);
  });

  bench('arkhe/takeWhile', () => {
    takeWhileArkhe([5, 4, 3, 2, 1], n => n < 4);
  });
});

describe('takeWhile/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);

  bench('es-toolkit/takeWhile', () => {
    takeWhileToolkit(largeArray, n => n < 100);
  });

  bench('es-toolkit/compat/takeWhile', () => {
    takeWhileCompatToolkit(largeArray, n => n < 100);
  });

  bench('lodash-es/takeWhile', () => {
    takeWhileLodashEs(largeArray, n => n < 100);
  });

  bench('arkhe/takeWhile', () => {
    takeWhileArkhe(largeArray, n => n < 100);
  });
});
