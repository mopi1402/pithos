// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { min as minCompatToolkit_ } from 'es-toolkit/compat';
import { min as minLodashEs_ } from 'lodash-es';
import { min as minTaphos_ } from '../../pithos/src/taphos/math/min';

const minCompatToolkit = minCompatToolkit_;
const minLodashEs = minLodashEs_;
const minTaphos = minTaphos_;

describe('min', () => {
  const arr = [1, 2, 3];

  bench('es-toolkit/compat/min', () => {
    minCompatToolkit(arr);
  });

  bench('lodash-es/min', () => {
    minLodashEs(arr);
  });

  bench('taphos/min', () => {
    minTaphos(arr);
  });

  bench('native/min', () => {
    Math.min(...arr);
  });
});

describe('min/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);

  bench('es-toolkit/compat/min', () => {
    minCompatToolkit(largeArray);
  });

  bench('lodash-es/min', () => {
    minLodashEs(largeArray);
  });

  bench('taphos/min', () => {
    minTaphos(largeArray);
  });

  bench('native/min', () => {
    Math.min(...largeArray);
  });
});
