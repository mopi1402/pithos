// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { differenceBy as differenceByToolkit_ } from 'es-toolkit';
import { differenceBy as differenceByCompatToolkit_ } from 'es-toolkit/compat';
import { differenceBy as differenceByLodashEs_ } from 'lodash-es';
import { differenceBy as differenceByArkhe_ } from '../../pithos/src/arkhe/array/difference-by';

const differenceByToolkit = differenceByToolkit_;
const differenceByCompatToolkit = differenceByCompatToolkit_;
const differenceByLodashEs = differenceByLodashEs_;
const differenceByArkhe = differenceByArkhe_;

describe('differenceBy', () => {
  bench('es-toolkit/differenceBy', () => {
    differenceByToolkit([1.2, 2.3, 3.4], [1.2], Math.floor);
  });

  bench('es-toolkit/compat/differenceBy', () => {
    differenceByCompatToolkit([1.2, 2.3, 3.4], [1.2], Math.floor);
  });

  bench('lodash-es/differenceBy', () => {
    differenceByLodashEs([1.2, 2.3, 3.4], [1.2], Math.floor);
  });

  bench('arkhe/differenceBy', () => {
    differenceByArkhe([1.2, 2.3, 3.4], [1.2], Math.floor);
  });
});

describe('differenceBy/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);
  const largeArray2 = Array.from({ length: 1000 }, (_, i) => i + 500.5);

  bench('es-toolkit/differenceBy', () => {
    differenceByToolkit(largeArray, largeArray2, Math.floor);
  });

  bench('es-toolkit/compat/differenceBy', () => {
    differenceByCompatToolkit(largeArray, largeArray2, Math.floor);
  });

  bench('lodash-es/differenceBy', () => {
    differenceByLodashEs(largeArray, largeArray2, Math.floor);
  });

  bench('arkhe/differenceBy', () => {
    differenceByArkhe(largeArray, largeArray2, Math.floor);
  });
});
