// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { ceil as ceilCompatToolkit_ } from 'es-toolkit/compat';
import { ceil as ceilLodashEs_ } from 'lodash-es';
import { ceil as ceilTaphos_ } from '../../pithos/src/taphos/math/ceil';

const ceilCompatToolkit = ceilCompatToolkit_;
const ceilLodashEs = ceilLodashEs_;
const ceilTaphos = ceilTaphos_;

describe('ceil', () => {
  bench('es-toolkit/compat/ceil', () => {
    ceilCompatToolkit(4.006);
    ceilCompatToolkit(4.006, 0);
    ceilCompatToolkit(4.016, 2);
    ceilCompatToolkit(4.1, 2);
    ceilCompatToolkit(4.4, 2);
    ceilCompatToolkit(4160, -2);
    ceilCompatToolkit(4.006, NaN);
    ceilCompatToolkit(4.016, 2.6);
    ceilCompatToolkit(5e1, 2);
  });

  bench('lodash-es/ceil', () => {
    ceilLodashEs(4.006);
    ceilLodashEs(4.006, 0);
    ceilLodashEs(4.016, 2);
    ceilLodashEs(4.1, 2);
    ceilLodashEs(4.4, 2);
    ceilLodashEs(4160, -2);
    ceilLodashEs(4.006, NaN);
    ceilLodashEs(4.016, 2.6);
    ceilLodashEs(5e1, 2);
  });

  bench('taphos/ceil', () => {
    ceilTaphos(4.006);
    ceilTaphos(4.006, 0);
    ceilTaphos(4.016, 2);
    ceilTaphos(4.1, 2);
    ceilTaphos(4.4, 2);
    ceilTaphos(4160, -2);
    ceilTaphos(4.006, NaN);
    ceilTaphos(4.016, 2.6);
    ceilTaphos(5e1, 2);
  });

  bench('native/ceil', () => {
    Math.ceil(4.006);
    Math.ceil(4.006);
    Math.ceil(4.016 * 100) / 100;
    Math.ceil(4.1 * 100) / 100;
    Math.ceil(4.4 * 100) / 100;
    Math.ceil(4160 / 100) * 100;
    Math.ceil(4.006);
    Math.ceil(4.016 * 100) / 100;
    Math.ceil(5e1 * 100) / 100;
  });
});
