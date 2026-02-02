// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { unionBy as unionByToolkit_ } from 'es-toolkit';
import { unionBy as unionByCompatToolkit_ } from 'es-toolkit/compat';
import { unionBy as unionByLodashEs_ } from 'lodash-es';
import { unionBy as unionByArkhe_ } from '../../pithos/src/arkhe/array/union-by';

const unionByToolkit = unionByToolkit_;
const unionByCompatToolkit = unionByCompatToolkit_;
const unionByLodashEs = unionByLodashEs_;
const unionByArkhe = unionByArkhe_;

describe('unionBy', () => {
  const array1 = [{ id: 1 }, { id: 2 }];
  const array2 = [{ id: 2 }, { id: 3 }];
  const getId = (x: { id: number }) => x.id;

  bench('es-toolkit/unionBy', () => {
    unionByToolkit(array1, array2, getId);
  });

  bench('es-toolkit/compat/unionBy', () => {
    unionByCompatToolkit(array1, array2, getId);
  });

  bench('lodash-es/unionBy', () => {
    unionByLodashEs(array1, array2, getId);
  });

  bench('arkhe/unionBy', () => {
    unionByArkhe([array1, array2], getId);
  });
});

describe('unionBy/largeArray', () => {
  const largeArray1 = Array.from({ length: 10000 }, (_, i) => ({ id: i }));
  const largeArray2 = Array.from({ length: 10000 }, (_, i) => ({ id: i + 5000 }));
  const getId = (x: { id: number }) => x.id;

  bench('es-toolkit/unionBy', () => {
    unionByToolkit(largeArray1, largeArray2, getId);
  });

  bench('es-toolkit/compat/unionBy', () => {
    unionByCompatToolkit(largeArray1, largeArray2, getId);
  });

  bench('lodash-es/unionBy', () => {
    unionByLodashEs(largeArray1, largeArray2, getId);
  });

  bench('arkhe/unionBy', () => {
    unionByArkhe([largeArray1, largeArray2], getId);
  });
});
