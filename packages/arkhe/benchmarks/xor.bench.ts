// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { xor as xorToolkit_ } from 'es-toolkit';
import { xor as xorLodashEs_ } from 'lodash-es';
import { xor as xorArkhe_ } from '../../pithos/src/arkhe/array/xor';

const xorToolkit = xorToolkit_;
const xorLodashEs = xorLodashEs_;
const xorArkhe = xorArkhe_;

describe('xor', () => {
  bench('es-toolkit/xor', () => {
    xorToolkit([1, 2, 3, 4], [3, 4, 5, 6]);
  });

  bench('lodash-es/xor', () => {
    xorLodashEs([1, 2, 3, 4], [3, 4, 5, 6]);
  });

  bench('arkhe/xor', () => {
    xorArkhe([[1, 2, 3, 4], [3, 4, 5, 6]]);
  });
});

describe('xor/largeArray', () => {
  const largeArray1 = Array.from({ length: 10000 }, (_, i) => i);
  const largeArray2 = Array.from({ length: 10000 }, (_, i) => i + 5000);

  bench('es-toolkit/xor', () => {
    xorToolkit(largeArray1, largeArray2);
  });

  bench('lodash-es/xor', () => {
    xorLodashEs(largeArray1, largeArray2);
  });

  bench('arkhe/xor', () => {
    xorArkhe([largeArray1, largeArray2]);
  });
});
