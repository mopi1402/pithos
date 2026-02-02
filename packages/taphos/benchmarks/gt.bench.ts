// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { gt as gtCompatToolkit_ } from 'es-toolkit/compat';
import { gt as gtLodashEs_ } from 'lodash-es';
import { gt as gtTaphos_ } from '../../pithos/src/taphos/lang/gt';

const gtCompatToolkit = gtCompatToolkit_;
const gtLodashEs = gtLodashEs_;
const gtTaphos = gtTaphos_;

describe('gt', () => {
  bench('es-toolkit/compat/gt', () => {
    gtCompatToolkit(3, 1);
        gtCompatToolkit(3, 3);
        gtCompatToolkit(1, 3);
  });

  bench('lodash-es/gt', () => {
    gtLodashEs(3, 1);
        gtLodashEs(3, 3);
        gtLodashEs(1, 3);
  });

  bench('taphos/gt', () => {
    gtTaphos(3, 1);
        gtTaphos(3, 3);
        gtTaphos(1, 3);
  });

  bench('native/gt', () => {
    3 > 1;
    3 > 3;
    1 > 3;
  });
});
