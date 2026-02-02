// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { partition as partitionToolkit_ } from 'es-toolkit';
import { partition as partitionCompatToolkit_ } from 'es-toolkit/compat';
import { partition as partitionLodashEs_ } from 'lodash-es';
import { partition as partitionArkhe_ } from '../../pithos/src/arkhe/array/partition';

const partitionToolkit = partitionToolkit_;
const partitionCompatToolkit = partitionCompatToolkit_;
const partitionLodashEs = partitionLodashEs_;
const partitionArkhe = partitionArkhe_;

describe('partition', () => {
  bench('es-toolkit/partition', () => {
    partitionToolkit([1, 2, 3, 4, 5], x => x < 3);
  });

  bench('es-toolkit/compat/partition', () => {
    partitionCompatToolkit([1, 2, 3, 4, 5], x => x < 3);
  });

  bench('lodash-es/partition', () => {
    partitionLodashEs([1, 2, 3, 4, 5], x => x < 3);
  });

  bench('arkhe/partition', () => {
    partitionArkhe([1, 2, 3, 4, 5], x => x < 3);
  });
});

describe('partition/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, index) => index);

  bench('es-toolkit/partition', () => {
    partitionToolkit(largeArray, x => x < 5000);
  });

  bench('es-toolkit/compat/partition', () => {
    partitionCompatToolkit(largeArray, x => x < 5000);
  });

  bench('lodash-es/partition', () => {
    partitionLodashEs(largeArray, x => x < 5000);
  });

  bench('arkhe/partition', () => {
    partitionArkhe(largeArray, x => x < 5000);
  });
});
