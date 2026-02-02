// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { differenceWith as differenceWithToolkit_ } from 'es-toolkit';
import { differenceWith as differenceWithCompatToolkit_ } from 'es-toolkit/compat';
import { differenceWith as differenceWithLodashEs_ } from 'lodash-es';
import { differenceWith as differenceWithArkhe_ } from '../../pithos/src/arkhe/array/difference-with';

const differenceWithToolkit = differenceWithToolkit_;
const differenceWithCompatToolkit = differenceWithCompatToolkit_;
const differenceWithLodashEs = differenceWithLodashEs_;
const differenceWithArkhe = differenceWithArkhe_;

describe('differenceWith', () => {
  bench('es-toolkit/differenceWith', () => {
    differenceWithToolkit([1.2, 2.3, 3.4], [1.2], (x, y) => Math.floor(x) === Math.floor(y));
  });

  bench('es-toolkit/compat/differenceWith', () => {
    differenceWithCompatToolkit([1.2, 2.3, 3.4], [1.2], (x, y) => Math.floor(x) === Math.floor(y));
  });

  bench('lodash-es/differenceWith', () => {
    differenceWithLodashEs([1.2, 2.3, 3.4], [1.2], (x, y) => Math.floor(x) === Math.floor(y));
  });

  bench('arkhe/differenceWith', () => {
    differenceWithArkhe([1.2, 2.3, 3.4], [1.2], (x, y) => Math.floor(x) === Math.floor(y));
  });
});

describe('differenceWith/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);
  const largeArray2 = Array.from({ length: 1000 }, (_, i) => i + 500.5);

  bench('es-toolkit/differenceWith', () => {
    differenceWithToolkit(largeArray, largeArray2, (x, y) => Math.floor(x) === Math.floor(y));
  });

  bench('es-toolkit/compat/differenceWith', () => {
    differenceWithCompatToolkit(largeArray, largeArray2, (x, y) => Math.floor(x) === Math.floor(y));
  });

  bench('lodash-es/differenceWith', () => {
    differenceWithLodashEs(largeArray, largeArray2, (x, y) => Math.floor(x) === Math.floor(y));
  });

  bench('arkhe/differenceWith', () => {
    differenceWithArkhe(largeArray, largeArray2, (x, y) => Math.floor(x) === Math.floor(y));
  });
});
