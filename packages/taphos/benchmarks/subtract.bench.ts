// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { subtract as subtractCompatToolkit_ } from 'es-toolkit/compat';
import { subtract as subtractLodashEs_ } from 'lodash-es';
import { subtract as subtractTaphos_ } from '../../pithos/src/taphos/math/subtract';

const subtractCompatToolkit = subtractCompatToolkit_;
const subtractLodashEs = subtractLodashEs_;
const subtractTaphos = subtractTaphos_;

describe('subtract', () => {
  bench('es-toolkit/compat/subtract', () => {
    subtractCompatToolkit(2, 3);
        subtractCompatToolkit(-1, -5);
        subtractCompatToolkit(NaN, 3);
        subtractCompatToolkit(3, NaN);
        subtractCompatToolkit(NaN, NaN);
  });

  bench('lodash-es/subtract', () => {
    subtractLodashEs(2, 3);
        subtractLodashEs(-1, -5);
        subtractLodashEs(NaN, 3);
        subtractLodashEs(3, NaN);
        subtractLodashEs(NaN, NaN);
  });

  bench('taphos/subtract', () => {
    subtractTaphos(2, 3);
        subtractTaphos(-1, -5);
        subtractTaphos(NaN, 3);
        subtractTaphos(3, NaN);
        subtractTaphos(NaN, NaN);
  });

  bench('native/subtract', () => {
    2 - 3;
    -1 - -5;
    NaN - 3;
    3 - NaN;
    NaN - NaN;
  });
});
