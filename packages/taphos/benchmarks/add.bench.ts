// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { add as addCompatToolkit_ } from 'es-toolkit/compat';
import { add as addLodashEs_ } from 'lodash-es';
import { add as addTaphos_ } from '../../pithos/src/taphos/math/add';

const addCompatToolkit = addCompatToolkit_;
const addLodashEs = addLodashEs_;
const addTaphos = addTaphos_;

describe('add', () => {
  bench('es-toolkit/compat/add', () => {
    addCompatToolkit(2, 3);
    addCompatToolkit(-1, -5);
    addCompatToolkit(NaN, 3);
    addCompatToolkit(3, NaN);
    addCompatToolkit(NaN, NaN);
  });

  bench('lodash-es/add', () => {
    addLodashEs(2, 3);
    addLodashEs(-1, -5);
    addLodashEs(NaN, 3);
    addLodashEs(3, NaN);
    addLodashEs(NaN, NaN);
  });

  bench('taphos/add', () => {
    addTaphos(2, 3);
    addTaphos(-1, -5);
    addTaphos(NaN, 3);
    addTaphos(3, NaN);
    addTaphos(NaN, NaN);
  });

  bench('native/add', () => {
    2 + 3;
    -1 + -5;
    NaN + 3;
    3 + NaN;
    NaN + NaN;
  });
});
