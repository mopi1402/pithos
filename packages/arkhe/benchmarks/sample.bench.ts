// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { sample as sampleToolkit_ } from 'es-toolkit';
import { sample as sampleCompatToolkit_ } from 'es-toolkit/compat';
import { sample as sampleLodashEs_ } from 'lodash-es';
import { sample as sampleArkhe_ } from '../../pithos/src/arkhe/array/sample';

const sampleToolkit = sampleToolkit_;
const sampleCompatToolkit = sampleCompatToolkit_;
const sampleLodashEs = sampleLodashEs_;
const sampleArkhe = sampleArkhe_;

describe('sample', () => {
  bench('es-toolkit/sample', () => {
    const array = [1, 2, 3, 4, 5];
        sampleToolkit(array);
  });

  bench('es-toolkit/compat/sample', () => {
    const array = [1, 2, 3, 4, 5];
        sampleCompatToolkit(array);
  });

  bench('lodash-es/sample', () => {
    const array = [1, 2, 3, 4, 5];
        sampleLodashEs(array);
  });

  bench('arkhe/sample', () => {
    const array = [1, 2, 3, 4, 5];
        sampleArkhe(array);
  });
});

describe('sample/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);

  bench('es-toolkit/sample', () => {
    sampleToolkit(largeArray);
  });

  bench('es-toolkit/compat/sample', () => {
    sampleCompatToolkit(largeArray);
  });

  bench('lodash-es/sample', () => {
    sampleLodashEs(largeArray);
  });

  bench('arkhe/sample', () => {
    sampleArkhe(largeArray);
  });
});
