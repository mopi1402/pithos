// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { head as headToolkit_ } from 'es-toolkit';
import { head as headCompatToolkit_ } from 'es-toolkit/compat';
import { head as headLodashEs_ } from 'lodash-es';
import { head as headTaphos_ } from '../../pithos/src/taphos/array/head';

const headToolkit = headToolkit_;
const headCompatToolkit = headCompatToolkit_;
const headLodashEs = headLodashEs_;
const headTaphos = headTaphos_;

describe('head', () => {
  const arr = [1, 2, 3, 4];

  bench('es-toolkit/head', () => {
    headToolkit(arr);
  });

  bench('es-toolkit/compat/head', () => {
    headCompatToolkit(arr);
  });

  bench('lodash-es/head', () => {
    headLodashEs(arr);
  });

  bench('taphos/head', () => {
    headTaphos(arr);
  });

  bench('native/head', () => {
    arr[0];
  });
});

describe('head/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);

  bench('es-toolkit/head', () => {
    headToolkit(largeArray);
  });

  bench('es-toolkit/compat/head', () => {
    headCompatToolkit(largeArray);
  });

  bench('lodash-es/head', () => {
    headLodashEs(largeArray);
  });

  bench('taphos/head', () => {
    headTaphos(largeArray);
  });

  bench('native/head', () => {
    largeArray[0];
  });
});
