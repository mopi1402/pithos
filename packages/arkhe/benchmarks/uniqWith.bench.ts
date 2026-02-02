// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { uniqWith as uniqWithToolkit_ } from 'es-toolkit';
import { uniqWith as uniqWithCompatToolkit_ } from 'es-toolkit/compat';
import { uniqWith as uniqWithLodashEs_ } from 'lodash-es';
import { uniqWith as uniqWithArkhe_ } from '../../pithos/src/arkhe/array/uniq-with';

const uniqWithToolkit = uniqWithToolkit_;
const uniqWithCompatToolkit = uniqWithCompatToolkit_;
const uniqWithLodashEs = uniqWithLodashEs_;
const uniqWithArkhe = uniqWithArkhe_;

describe('uniqWith/smallArrays', () => {
  bench('es-toolkit/uniqWith', () => {
    uniqWithToolkit([2.1, 1.2, 2.3], (x, y) => Math.floor(x) === Math.floor(y));
  });

  bench('es-toolkit/compat/uniqWith', () => {
    uniqWithCompatToolkit([2.1, 1.2, 2.3], (x, y) => Math.floor(x) === Math.floor(y));
  });

  bench('lodash-es/uniqWith', () => {
    uniqWithLodashEs([2.1, 1.2, 2.3], (x, y) => Math.floor(x) === Math.floor(y));
  });

  bench('arkhe/uniqWith', () => {
    uniqWithArkhe([2.1, 1.2, 2.3], (x, y) => Math.floor(x) === Math.floor(y));
  });
});

describe('uniqWith/largeArrays', () => {
  const array = Array.from({ length: 1000 }, (_, i) => i % 100 + Math.random());
  const comparator = (x: number, y: number) => Math.floor(x) === Math.floor(y);

  bench('es-toolkit/uniqWith', () => {
    uniqWithToolkit(array, comparator);
  });

  bench('es-toolkit/compat/uniqWith', () => {
    uniqWithCompatToolkit(array, comparator);
  });

  bench('lodash-es/uniqWith', () => {
    uniqWithLodashEs(array, comparator);
  });

  bench('arkhe/uniqWith', () => {
    uniqWithArkhe(array, comparator);
  });
});
