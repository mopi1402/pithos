// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { dropRight as dropRightToolkit_ } from 'es-toolkit';
import { dropRight as dropRightCompatToolkit_ } from 'es-toolkit/compat';
import { dropRight as dropRightLodashEs_ } from 'lodash-es';
import { dropRight as dropRightArkhe_ } from '../../pithos/src/arkhe/array/drop-right';

const dropRightToolkit = dropRightToolkit_;
const dropRightCompatToolkit = dropRightCompatToolkit_;
const dropRightLodashEs = dropRightLodashEs_;
const dropRightArkhe = dropRightArkhe_;

describe('dropRight', () => {
  bench('es-toolkit/dropRight', () => {
    dropRightToolkit([1, 2, 3, 4, 5, 6], 3);
  });

  bench('es-toolkit/compat/dropRight', () => {
    dropRightCompatToolkit([1, 2, 3, 4, 5, 6], 3);
  });

  bench('lodash-es/dropRight', () => {
    dropRightLodashEs([1, 2, 3, 4, 5, 6], 3);
  });

  bench('arkhe/dropRight', () => {
    dropRightArkhe([1, 2, 3, 4, 5, 6], 3);
  });
});

describe('dropRight/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);

  bench('es-toolkit/dropRight', () => {
    dropRightToolkit(largeArray, 5000);
  });

  bench('es-toolkit/compat/dropRight', () => {
    dropRightCompatToolkit(largeArray, 5000);
  });

  bench('lodash-es/dropRight', () => {
    dropRightLodashEs(largeArray, 5000);
  });

  bench('arkhe/dropRight', () => {
    dropRightArkhe(largeArray, 5000);
  });
});
