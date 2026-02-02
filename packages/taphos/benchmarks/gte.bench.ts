// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { gte as gteCompatToolkit_ } from 'es-toolkit/compat';
import { gte as gteLodashEs_ } from 'lodash-es';
import { gte as gteTaphos_ } from '../../pithos/src/taphos/lang/gte';

const gteCompatToolkit = gteCompatToolkit_;
const gteLodashEs = gteLodashEs_;
const gteTaphos = gteTaphos_;

describe('gte', () => {
  bench('es-toolkit/compat/gte', () => {
    gteCompatToolkit(3, 1);
        gteCompatToolkit(3, 3);
        gteCompatToolkit(1, 3);
  });

  bench('lodash-es/gte', () => {
    gteLodashEs(3, 1);
        gteLodashEs(3, 3);
        gteLodashEs(1, 3);
  });

  bench('taphos/gte', () => {
    gteTaphos(3, 1);
        gteTaphos(3, 3);
        gteTaphos(1, 3);
  });

  bench('native/gte', () => {
    3 >= 1;
    3 >= 3;
    1 >= 3;
  });
});
