// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { initial as initialToolkit_ } from 'es-toolkit';
import { initial as initialCompatToolkit_ } from 'es-toolkit/compat';
import { initial as initialLodashEs_ } from 'lodash-es';
import { initial as initialTaphos_ } from '../../pithos/src/taphos/array/initial';

const initialToolkit = initialToolkit_;
const initialCompatToolkit = initialCompatToolkit_;
const initialLodashEs = initialLodashEs_;
const initialTaphos = initialTaphos_;

describe('initial', () => {
  const arr = [1, 2, 3, 4, 5, 6];

  bench('es-toolkit/initial', () => {
    initialToolkit(arr);
  });

  bench('es-toolkit/compat/initial', () => {
    initialCompatToolkit(arr);
  });

  bench('lodash-es/initial', () => {
    initialLodashEs(arr);
  });

  bench('taphos/initial', () => {
    initialTaphos(arr);
  });

  bench('native/initial', () => {
    arr.slice(0, -1);
  });
});

describe('initial/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);

  bench('es-toolkit/initial', () => {
    initialToolkit(largeArray);
  });

  bench('es-toolkit/compat/initial', () => {
    initialCompatToolkit(largeArray);
  });

  bench('lodash-es/initial', () => {
    initialLodashEs(largeArray);
  });

  bench('taphos/initial', () => {
    initialTaphos(largeArray);
  });

  bench('native/initial', () => {
    largeArray.slice(0, -1);
  });
});
