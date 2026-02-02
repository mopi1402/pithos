// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { intersectionBy as intersectionByToolkit_ } from 'es-toolkit';
import { intersectionBy as intersectionByCompatToolkit_ } from 'es-toolkit/compat';
import { intersectionBy as intersectionByLodashEs_ } from 'lodash-es';
import { intersectionBy as intersectionByArkhe_ } from '../../pithos/src/arkhe/array/intersection-by';

const intersectionByToolkit = intersectionByToolkit_;
const intersectionByCompatToolkit = intersectionByCompatToolkit_;
const intersectionByLodashEs = intersectionByLodashEs_;
const intersectionByArkhe = intersectionByArkhe_;

describe('intersectionBy', () => {
  const array1 = [{ id: 1 }, { id: 2 }, { id: 3 }];
  const array2 = [{ id: 2 }, { id: 4 }];
  const mapper = (item: { id: number }) => item.id;

  bench('es-toolkit/intersectionBy', () => {
    intersectionByToolkit(array1, array2, mapper);
  });

  bench('es-toolkit/compat/intersectionBy', () => {
    intersectionByCompatToolkit(array1, array2, mapper);
  });

  bench('lodash-es/intersectionBy', () => {
    intersectionByLodashEs(array1, array2, mapper);
  });

  bench('arkhe/intersectionBy', () => {
    intersectionByArkhe([array1, array2], mapper);
  });
});

describe('intersectionBy/largeArrays', () => {
  const array1 = Array.from({ length: 10000 }, (_, i) => ({ id: i }));
  const array2 = Array.from({ length: 10000 }, (_, i) => ({ id: i + 5000 }));
  const mapper = (item: { id: number }) => item.id;

  bench('es-toolkit/intersectionBy', () => {
    intersectionByToolkit(array1, array2, mapper);
  });

  bench('es-toolkit/compat/intersectionBy', () => {
    intersectionByCompatToolkit(array1, array2, mapper);
  });

  bench('lodash-es/intersectionBy', () => {
    intersectionByLodashEs(array1, array2, mapper);
  });

  bench('arkhe/intersectionBy', () => {
    intersectionByArkhe([array1, array2], mapper);
  });
});
