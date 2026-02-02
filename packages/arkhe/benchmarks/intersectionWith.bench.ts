// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { intersectionWith as intersectionWithToolkit_ } from 'es-toolkit';
import { intersectionWith as intersectionWithCompatToolkit_ } from 'es-toolkit/compat';
import { intersectionWith as intersectionWithLodashEs_ } from 'lodash-es';
import { intersectionWith as intersectionWithArkhe_ } from '../../pithos/src/arkhe/array/intersection-with';

const intersectionWithToolkit = intersectionWithToolkit_;
const intersectionWithCompatToolkit = intersectionWithCompatToolkit_;
const intersectionWithLodashEs = intersectionWithLodashEs_;
const intersectionWithArkhe = intersectionWithArkhe_;

describe('intersectionWith', () => {
  bench('es-toolkit/intersectionWith', () => {
    const array1 = [{ id: 1 }, { id: 2 }, { id: 3 }];
        const array2 = [{ id: 2 }, { id: 4 }];
        const areItemsEqual = (a: { id: number }, b: { id: number }) => a.id === b.id;
        intersectionWithToolkit(array1, array2, areItemsEqual);
  });

  bench('es-toolkit/compat/intersectionWith', () => {
    const array1 = [{ id: 1 }, { id: 2 }, { id: 3 }];
        const array2 = [{ id: 2 }, { id: 4 }];
        const areItemsEqual = (a: { id: number }, b: { id: number }) => a.id === b.id;
        intersectionWithCompatToolkit(array1, array2, areItemsEqual);
  });

  bench('lodash-es/intersectionWith', () => {
    const array1 = [{ id: 1 }, { id: 2 }, { id: 3 }];
        const array2 = [{ id: 2 }, { id: 4 }];
        const areItemsEqual = (a: { id: number }, b: { id: number }) => a.id === b.id;
        intersectionWithLodashEs(array1, array2, areItemsEqual);
  });

  bench('arkhe/intersectionWith', () => {
    const array1 = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const array2 = [{ id: 2 }, { id: 4 }];
    const areItemsEqual = (a: { id: number }, b: { id: number }) => a.id === b.id;
    // Arkhe takes arrays as a single array parameter: intersectionWith([arr1, arr2], comparator)
    intersectionWithArkhe([array1, array2], areItemsEqual);
  });
});

describe('intersectionWith/largeArrays', () => {
  const array1 = Array.from({ length: 10000 }, (_, i) => ({ id: i }));
  const array2 = Array.from({ length: 10000 }, (_, i) => ({ id: i + 5000 }));
  const areItemsEqual = (a: { id: number }, b: { id: number }) => a.id === b.id;

  bench('es-toolkit/intersectionWith', () => {
    intersectionWithToolkit(array1, array2, areItemsEqual);
  });

  bench('es-toolkit/compat/intersectionWith', () => {
    intersectionWithCompatToolkit(array1, array2, areItemsEqual);
  });

  bench('lodash-es/intersectionWith', () => {
    intersectionWithLodashEs(array1, array2, areItemsEqual);
  });

  bench('arkhe/intersectionWith', () => {
    // Arkhe takes arrays as a single array parameter: intersectionWith([arr1, arr2], comparator)
    intersectionWithArkhe([array1, array2], areItemsEqual);
  });
});
