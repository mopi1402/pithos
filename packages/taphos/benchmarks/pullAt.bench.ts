// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { pullAt as pullAtToolkit_ } from 'es-toolkit';
import { pullAt as pullAtCompatToolkit_ } from 'es-toolkit/compat';
import { pullAt as pullAtLodashEs_ } from 'lodash-es';
import { pullAt as pullAtTaphos_ } from '../../pithos/src/taphos/array/pullAt';

const pullAtToolkit = pullAtToolkit_;
const pullAtCompatToolkit = pullAtCompatToolkit_;
const pullAtLodashEs = pullAtLodashEs_;
const pullAtTaphos = pullAtTaphos_;

describe('pullAt', () => {
  bench('es-toolkit/pullAt', () => {
    const array = [0, 1, 2, 3, 4, 5];
        const indexes = [3, 5, 1, 2];
        pullAtToolkit(array, indexes);
  });

  bench('es-toolkit/compat/pullAt', () => {
    const array = [0, 1, 2, 3, 4, 5];
        const indexes = [3, 5, 1, 2];
        pullAtCompatToolkit(array, indexes);
  });

  bench('lodash-es/pullAt', () => {
    const array = [0, 1, 2, 3, 4, 5];
        const indexes = [3, 5, 1, 2];
        pullAtLodashEs(array, indexes);
  });

  bench('taphos/pullAt', () => {
    const array = [0, 1, 2, 3, 4, 5];
        const indexes = [3, 5, 1, 2];
        pullAtTaphos(array, indexes);
  });

  bench('native/pullAt', () => {
    const array = [0, 1, 2, 3, 4, 5];
    const indexes = [3, 5, 1, 2];
    // Native immutable approach
    const indexSet = new Set(indexes);
    array.filter((_, i) => !indexSet.has(i));
  });
});

describe('pullAt/largeArray', () => {
  bench('es-toolkit/pullAt', () => {
    const largeArray = Array.from({ length: 10000 }, (_, i) => i);
        const largeIndexes = Array.from({ length: 1000 }, (_, i) => i + 1000);
        pullAtToolkit(largeArray, largeIndexes);
  });

  bench('es-toolkit/compat/pullAt', () => {
    const largeArray = Array.from({ length: 10000 }, (_, i) => i);
        const largeIndexes = Array.from({ length: 1000 }, (_, i) => i + 1000);
        pullAtCompatToolkit(largeArray, largeIndexes);
  });

  bench('lodash-es/pullAt', () => {
    const largeArray = Array.from({ length: 10000 }, (_, i) => i);
        const largeIndexes = Array.from({ length: 1000 }, (_, i) => i + 1000);
        pullAtLodashEs(largeArray, largeIndexes);
  });

  bench('taphos/pullAt', () => {
    const largeArray = Array.from({ length: 10000 }, (_, i) => i);
        const largeIndexes = Array.from({ length: 1000 }, (_, i) => i + 1000);
        pullAtTaphos(largeArray, largeIndexes);
  });

  bench('native/pullAt', () => {
    const largeArray = Array.from({ length: 10000 }, (_, i) => i);
    const largeIndexes = Array.from({ length: 1000 }, (_, i) => i + 1000);
    const indexSet = new Set(largeIndexes);
    largeArray.filter((_, i) => !indexSet.has(i));
  });
});
