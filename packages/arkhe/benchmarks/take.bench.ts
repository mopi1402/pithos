// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { take as takeToolkit_ } from 'es-toolkit';
import { take as takeCompatToolkit_ } from 'es-toolkit/compat';
import { take as takeLodashEs_ } from 'lodash-es';
import { take as takeArkhe_ } from '../../pithos/src/arkhe/array/take';

const takeToolkit = takeToolkit_;
const takeCompatToolkit = takeCompatToolkit_;
const takeLodashEs = takeLodashEs_;
const takeArkhe = takeArkhe_;

describe('take', () => {
  bench('es-toolkit/take', () => {
    takeToolkit([1, 2, 3, 4], 2);
  });

  bench('es-toolkit/compat/take', () => {
    takeCompatToolkit([1, 2, 3, 4], 2);
  });

  bench('lodash-es/take', () => {
    takeLodashEs([1, 2, 3, 4], 2);
  });

  bench('arkhe/take', () => {
    takeArkhe([1, 2, 3, 4], 2);
  });
});

describe('take/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);

  bench('es-toolkit/take', () => {
    takeToolkit(largeArray, 100);
  });

  bench('es-toolkit/compat/take', () => {
    takeCompatToolkit(largeArray, 100);
  });

  bench('lodash-es/take', () => {
    takeLodashEs(largeArray, 100);
  });

  bench('arkhe/take', () => {
    takeArkhe(largeArray, 100);
  });
});
