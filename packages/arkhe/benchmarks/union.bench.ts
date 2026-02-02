// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { union as unionToolkit_ } from 'es-toolkit';
import { union as unionCompatToolkit_ } from 'es-toolkit/compat';
import { union as unionLodashEs_ } from 'lodash-es';
import { union as unionArkhe_ } from '../../pithos/src/arkhe/array/union';

const unionToolkit = unionToolkit_;
const unionCompatToolkit = unionCompatToolkit_;
const unionLodashEs = unionLodashEs_;
const unionArkhe = unionArkhe_;

describe('union', () => {
  const array1 = [1, 2, 3];
  const array2 = [3, 4, 5];

  bench('es-toolkit/union', () => {
    unionToolkit(array1, array2);
  });

  bench('es-toolkit/compat/union', () => {
    unionCompatToolkit(array1, array2);
  });

  bench('lodash-es/union', () => {
    unionLodashEs(array1, array2);
  });

  bench('arkhe/union', () => {
    unionArkhe([array1, array2]);
  });
});

describe('union/largeArray', () => {
  const largeArray1 = Array.from({ length: 10000 }, (_, i) => i);
  const largeArray2 = Array.from({ length: 10000 }, (_, i) => i + 5000);

  bench('es-toolkit/union', () => {
    unionToolkit(largeArray1, largeArray2);
  });

  bench('es-toolkit/compat/union', () => {
    unionCompatToolkit(largeArray1, largeArray2);
  });

  bench('lodash-es/union', () => {
    unionLodashEs(largeArray1, largeArray2);
  });

  bench('arkhe/union', () => {
    unionArkhe([largeArray1, largeArray2]);
  });
});
