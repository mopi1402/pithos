// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { unionWith as unionWithToolkit_ } from 'es-toolkit';
import { unionWith as unionWithCompatToolkit_ } from 'es-toolkit/compat';
import { unionWith as unionWithLodashEs_ } from 'lodash-es';
import { unionWith as unionWithArkhe_ } from '../../pithos/src/arkhe/array/union-with';

const unionWithToolkit = unionWithToolkit_;
const unionWithCompatToolkit = unionWithCompatToolkit_;
const unionWithLodashEs = unionWithLodashEs_;
const unionWithArkhe = unionWithArkhe_;

describe('unionWith', () => {
  const array1 = [{ id: 1 }, { id: 2 }];
  const array2 = [{ id: 2 }, { id: 3 }];
  const areItemsEqual = (a: { id: number }, b: { id: number }) => a.id === b.id;

  bench('es-toolkit/unionWith', () => {
    unionWithToolkit(array1, array2, areItemsEqual);
  });

  bench('es-toolkit/compat/unionWith', () => {
    unionWithCompatToolkit(array1, array2, areItemsEqual);
  });

  bench('lodash-es/unionWith', () => {
    unionWithLodashEs(array1, array2, areItemsEqual);
  });

  bench('arkhe/unionWith', () => {
    unionWithArkhe([array1, array2], areItemsEqual);
  });
});

describe('unionWith/largeArray', () => {
  const largeArray1 = Array.from({ length: 1000 }, (_, i) => ({ id: i }));
  const largeArray2 = Array.from({ length: 1000 }, (_, i) => ({ id: i + 500 }));
  const areItemsEqual = (a: { id: number }, b: { id: number }) => a.id === b.id;

  bench('es-toolkit/unionWith', () => {
    unionWithToolkit(largeArray1, largeArray2, areItemsEqual);
  });

  bench('es-toolkit/compat/unionWith', () => {
    unionWithCompatToolkit(largeArray1, largeArray2, areItemsEqual);
  });

  bench('lodash-es/unionWith', () => {
    unionWithLodashEs(largeArray1, largeArray2, areItemsEqual);
  });

  bench('arkhe/unionWith', () => {
    unionWithArkhe([largeArray1, largeArray2], areItemsEqual);
  });
});
