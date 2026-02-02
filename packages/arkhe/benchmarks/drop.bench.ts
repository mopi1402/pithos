// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { drop as dropToolkit_ } from 'es-toolkit';
import { drop as dropCompatToolkit_ } from 'es-toolkit/compat';
import { drop as dropLodashEs_ } from 'lodash-es';
import { drop as dropArkhe_ } from '../../pithos/src/arkhe/array/drop';

const dropToolkit = dropToolkit_;
const dropCompatToolkit = dropCompatToolkit_;
const dropLodashEs = dropLodashEs_;
const dropArkhe = dropArkhe_;

describe('drop', () => {
  bench('es-toolkit/drop', () => {
    dropToolkit([1, 2, 3, 4, 5, 6], 3);
  });

  bench('es-toolkit/compat/drop', () => {
    dropCompatToolkit([1, 2, 3, 4, 5, 6], 3);
  });

  bench('lodash-es/drop', () => {
    dropLodashEs([1, 2, 3, 4, 5, 6], 3);
  });

  bench('arkhe/drop', () => {
    dropArkhe([1, 2, 3, 4, 5, 6], 3);
  });
});

describe('drop/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);

  bench('es-toolkit/drop', () => {
    dropToolkit(largeArray, 5000);
  });

  bench('es-toolkit/compat/drop', () => {
    dropCompatToolkit(largeArray, 5000);
  });

  bench('lodash-es/drop', () => {
    dropLodashEs(largeArray, 5000);
  });

  bench('arkhe/drop', () => {
    dropArkhe(largeArray, 5000);
  });
});
