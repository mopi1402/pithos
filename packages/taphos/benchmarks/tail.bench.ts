// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { tail as tailToolkit_ } from 'es-toolkit';
import { tail as tailCompatToolkit_ } from 'es-toolkit/compat';
import { tail as tailLodashEs_ } from 'lodash-es';
import { tail as tailTaphos_ } from '../../pithos/src/taphos/array/tail';

const tailToolkit = tailToolkit_;
const tailCompatToolkit = tailCompatToolkit_;
const tailLodashEs = tailLodashEs_;
const tailTaphos = tailTaphos_;

describe('tail', () => {
  bench('es-toolkit/tail', () => {
    tailToolkit([1, 2, 3, 4]);
  });

  bench('es-toolkit/compat/tail', () => {
    tailCompatToolkit([1, 2, 3, 4]);
  });

  bench('lodash-es/tail', () => {
    tailLodashEs([1, 2, 3, 4]);
  });

  bench('taphos/tail', () => {
    tailTaphos([1, 2, 3, 4]);
  });

  bench('native/tail', () => {
    [1, 2, 3, 4].slice(1);
  });
});

describe('tail/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);

  bench('es-toolkit/tail', () => {
    tailToolkit(largeArray);
  });

  bench('es-toolkit/compat/tail', () => {
    tailCompatToolkit(largeArray);
  });

  bench('lodash-es/tail', () => {
    tailLodashEs(largeArray);
  });

  bench('taphos/tail', () => {
    tailTaphos(largeArray);
  });

  bench('native/tail', () => {
    largeArray.slice(1);
  });
});
