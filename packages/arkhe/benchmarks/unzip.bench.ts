// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { unzip as unzipToolkit_ } from 'es-toolkit';
import { unzip as unzipCompatToolkit_ } from 'es-toolkit/compat';
import { unzip as unzipLodashEs_ } from 'lodash-es';
import { unzip as unzipArkhe_ } from '../../pithos/src/arkhe/array/unzip';

const unzipToolkit = unzipToolkit_;
const unzipCompatToolkit = unzipCompatToolkit_;
const unzipLodashEs = unzipLodashEs_;
const unzipArkhe = unzipArkhe_;

describe('unzip/smallArrays', () => {
  bench('es-toolkit/unzip', () => {
    unzipToolkit([
          ['a', 1, true],
          ['b', 2, false],
        ]);
  });

  bench('es-toolkit/compat/unzip', () => {
    unzipCompatToolkit([
          ['a', 1, true],
          ['b', 2, false],
        ]);
  });

  bench('lodash-es/unzip', () => {
    unzipLodashEs([
          ['a', 1, true],
          ['b', 2, false],
        ]);
  });

  bench('arkhe/unzip', () => {
    unzipArkhe([
          ['a', 1, true],
          ['b', 2, false],
        ]);
  });
});

describe('unzip/largeArrays', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => ['a', i, true]);

  bench('es-toolkit/unzip', () => {
    unzipToolkit(largeArray);
  });

  bench('es-toolkit/compat/unzip', () => {
    unzipCompatToolkit(largeArray);
  });

  bench('lodash-es/unzip', () => {
    unzipLodashEs(largeArray);
  });

  bench('arkhe/unzip', () => {
    unzipArkhe(largeArray);
  });
});
