// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { sampleSize as sampleSizeToolkit_ } from 'es-toolkit';
import { sampleSize as sampleSizeCompatToolkit_ } from 'es-toolkit/compat';
import { sampleSize as sampleSizeLodashEs_ } from 'lodash-es';
import { sampleSize as sampleSizeArkhe_ } from '../../pithos/src/arkhe/array/sample-size';

const sampleSizeToolkit = sampleSizeToolkit_;
const sampleSizeCompatToolkit = sampleSizeCompatToolkit_;
const sampleSizeLodashEs = sampleSizeLodashEs_;
const sampleSizeArkhe = sampleSizeArkhe_;

describe('sampleSize', () => {
  bench('es-toolkit/sampleSize', () => {
    const array = [1, 2, 3, 4, 5];
        sampleSizeToolkit(array, 3);
  });

  bench('es-toolkit/compat/sampleSize', () => {
    const array = [1, 2, 3, 4, 5];
        sampleSizeCompatToolkit(array, 3);
  });

  bench('lodash-es/sampleSize', () => {
    const array = [1, 2, 3, 4, 5];
        sampleSizeLodashEs(array, 3);
  });

  bench('arkhe/sampleSize', () => {
    const array = [1, 2, 3, 4, 5];
        sampleSizeArkhe(array, 3);
  });
});

describe('sampleSize/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);

  bench('es-toolkit/sampleSize', () => {
    sampleSizeToolkit(largeArray, 100);
  });

  bench('es-toolkit/compat/sampleSize', () => {
    sampleSizeCompatToolkit(largeArray, 100);
  });

  bench('lodash-es/sampleSize', () => {
    sampleSizeLodashEs(largeArray, 100);
  });

  bench('arkhe/sampleSize', () => {
    sampleSizeArkhe(largeArray, 100);
  });
});
