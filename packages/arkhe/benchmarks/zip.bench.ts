// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { zip as zipToolkit_ } from 'es-toolkit';
import { zip as zipCompatToolkit_ } from 'es-toolkit/compat';
import { zip as zipLodashEs_ } from 'lodash-es';
import { zip as zipArkhe_ } from '../../pithos/src/arkhe/array/zip';

const zipToolkit = zipToolkit_;
const zipCompatToolkit = zipCompatToolkit_;
const zipLodashEs = zipLodashEs_;
const zipArkhe = zipArkhe_;

describe('zip', () => {
  bench('es-toolkit/zip', () => {
    zipToolkit([1, 2, 3, 4], [3, 4, 5, 6]);
  });

  bench('es-toolkit/compat/zip', () => {
    zipCompatToolkit([1, 2, 3, 4], [3, 4, 5, 6]);
  });

  bench('lodash-es/zip', () => {
    zipLodashEs([1, 2, 3, 4], [3, 4, 5, 6]);
  });

  bench('arkhe/zip', () => {
    zipArkhe([1, 2, 3, 4], [3, 4, 5, 6]);
  });
});

describe('zip/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);

  bench('es-toolkit/zip', () => {
    zipToolkit(largeArray, largeArray);
  });

  bench('es-toolkit/compat/zip', () => {
    zipCompatToolkit(largeArray, largeArray);
  });

  bench('lodash-es/zip', () => {
    zipLodashEs(largeArray, largeArray);
  });

  bench('arkhe/zip', () => {
    zipArkhe(largeArray, largeArray);
  });
});
