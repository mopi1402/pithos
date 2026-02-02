// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { without as withoutToolkit_ } from 'es-toolkit';
import { without as withoutCompatToolkit_ } from 'es-toolkit/compat';
import { without as withoutLodashEs_ } from 'lodash-es';
import { without as withoutTaphos_ } from '../../pithos/src/taphos/array/without';

const withoutToolkit = withoutToolkit_;
const withoutCompatToolkit = withoutCompatToolkit_;
const withoutLodashEs = withoutLodashEs_;
const withoutTaphos = withoutTaphos_;

const generateArray = (length: number, max: number) => Array.from({ length }, () => Math.floor(Math.random() * max));

describe('without/smallArrays', () => {
  const array = [1, 2, 3, 4, 5];
  const values = [2, 4];

  bench('es-toolkit/without', () => {
    withoutToolkit(array, ...values);
  });

  bench('es-toolkit/compat/without', () => {
    withoutCompatToolkit(array, ...values);
  });

  bench('lodash-es/without', () => {
    withoutLodashEs(array, ...values);
  });

  bench('taphos/without', () => {
    withoutTaphos(array, ...values);
  });

  bench('native/without', () => {
    const valuesSet = new Set(values);
    array.filter(x => !valuesSet.has(x));
  });
});

describe('without/largeArrays', () => {
  const array = generateArray(10000, 1000);
  const values = generateArray(100, 1000);

  bench('es-toolkit/without', () => {
    withoutToolkit(array, ...values);
  });

  bench('es-toolkit/compat/without', () => {
    withoutCompatToolkit(array, ...values);
  });

  bench('lodash-es/without', () => {
    withoutLodashEs(array, ...values);
  });

  bench('taphos/without', () => {
    withoutTaphos(array, ...values);
  });

  bench('native/without', () => {
    const valuesSet = new Set(values);
    array.filter(x => !valuesSet.has(x));
  });
});
