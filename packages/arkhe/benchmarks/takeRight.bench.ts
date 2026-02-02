// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { takeRight as takeRightToolkit_ } from 'es-toolkit';
import { takeRight as takeRightCompatToolkit_ } from 'es-toolkit/compat';
import { takeRight as takeRightLodashEs_ } from 'lodash-es';
import { takeRight as takeRightArkhe_ } from '../../pithos/src/arkhe/array/take-right';

const takeRightToolkit = takeRightToolkit_;
const takeRightCompatToolkit = takeRightCompatToolkit_;
const takeRightLodashEs = takeRightLodashEs_;
const takeRightArkhe = takeRightArkhe_;

describe('takeRight', () => {
  bench('es-toolkit/takeRight', () => {
    takeRightToolkit([1, 2, 3, 4], 2);
  });

  bench('es-toolkit/compat/takeRight', () => {
    takeRightCompatToolkit([1, 2, 3, 4], 2);
  });

  bench('lodash-es/takeRight', () => {
    takeRightLodashEs([1, 2, 3, 4], 2);
  });

  bench('arkhe/takeRight', () => {
    takeRightArkhe([1, 2, 3, 4], 2);
  });
});

describe('takeRight/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);

  bench('es-toolkit/takeRight', () => {
    takeRightToolkit(largeArray, 100);
  });

  bench('es-toolkit/compat/takeRight', () => {
    takeRightCompatToolkit(largeArray, 100);
  });

  bench('lodash-es/takeRight', () => {
    takeRightLodashEs(largeArray, 100);
  });

  bench('arkhe/takeRight', () => {
    takeRightArkhe(largeArray, 100);
  });
});
