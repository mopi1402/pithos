// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { slice as sliceCompatToolkit_ } from 'es-toolkit/compat';
import { slice as sliceLodashEs_ } from 'lodash-es';
import { slice as sliceTaphos_ } from '../../pithos/src/taphos/array/slice';

const sliceCompatToolkit = sliceCompatToolkit_;
const sliceLodashEs = sliceLodashEs_;
const sliceTaphos = sliceTaphos_;

describe('slice', () => {
  const array = Array(1000);

  bench('es-toolkit/compat/slice', () => {
    sliceCompatToolkit(array);
        sliceCompatToolkit(array, 1);
        sliceCompatToolkit(array, 1, 2);
        sliceCompatToolkit(array, 1, 1000);
  });

  bench('lodash-es/slice', () => {
    sliceLodashEs(array);
        sliceLodashEs(array, 1);
        sliceLodashEs(array, 1, 2);
        sliceLodashEs(array, 1, 1000);
  });

  bench('taphos/slice', () => {
    sliceTaphos(array);
        sliceTaphos(array, 1);
        sliceTaphos(array, 1, 2);
        sliceTaphos(array, 1, 1000);
  });

  bench('native/slice', () => {
    array.slice();
    array.slice(1);
    array.slice(1, 2);
    array.slice(1, 1000);
  });
});
