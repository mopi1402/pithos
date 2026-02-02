// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { multiply as multiplyCompatToolkit_ } from 'es-toolkit/compat';
import { multiply as multiplyLodashEs_ } from 'lodash-es';
import { multiply as multiplyTaphos_ } from '../../pithos/src/taphos/math/multiply';

const multiplyCompatToolkit = multiplyCompatToolkit_;
const multiplyLodashEs = multiplyLodashEs_;
const multiplyTaphos = multiplyTaphos_;

describe('multiply', () => {
  bench('es-toolkit/compat/multiply', () => {
    multiplyCompatToolkit(3, 4);
    multiplyCompatToolkit(-3, -4);
    multiplyCompatToolkit(NaN, 3);
    multiplyCompatToolkit(3, NaN);
    multiplyCompatToolkit(NaN, NaN);
  });

  bench('lodash-es/multiply', () => {
    multiplyLodashEs(3, 4);
    multiplyLodashEs(-3, -4);
    multiplyLodashEs(NaN, 3);
    multiplyLodashEs(3, NaN);
    multiplyLodashEs(NaN, NaN);
  });

  bench('taphos/multiply', () => {
    multiplyTaphos(3, 4);
    multiplyTaphos(-3, -4);
    multiplyTaphos(NaN, 3);
    multiplyTaphos(3, NaN);
    multiplyTaphos(NaN, NaN);
  });

  bench('native/multiply', () => {
    3 * 4;
    -3 * -4;
    NaN * 3;
    3 * NaN;
    NaN * NaN;
  });
});
