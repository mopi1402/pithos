// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { max as maxCompatToolkit_ } from 'es-toolkit/compat';
import { max as maxLodashEs_ } from 'lodash-es';
import { max as maxTaphos_ } from '../../pithos/src/taphos/math/max';

const maxCompatToolkit = maxCompatToolkit_;
const maxLodashEs = maxLodashEs_;
const maxTaphos = maxTaphos_;

describe('max', () => {
  const arr = [1, 2, 3];

  bench('es-toolkit/compat/max', () => {
    maxCompatToolkit(arr);
  });

  bench('lodash-es/max', () => {
    maxLodashEs(arr);
  });

  bench('taphos/max', () => {
    maxTaphos(arr);
  });

  bench('native/max', () => {
    Math.max(...arr);
  });
});

describe('max/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);

  bench('es-toolkit/compat/max', () => {
    maxCompatToolkit(largeArray);
  });

  bench('lodash-es/max', () => {
    maxLodashEs(largeArray);
  });

  bench('taphos/max', () => {
    maxTaphos(largeArray);
  });

  bench('native/max', () => {
    Math.max(...largeArray);
  });
});
