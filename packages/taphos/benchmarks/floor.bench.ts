// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { floor as floorCompatToolkit_ } from 'es-toolkit/compat';
import { floor as floorLodashEs_ } from 'lodash-es';
import { floor as floorTaphos_ } from '../../pithos/src/taphos/math/floor';

const floorCompatToolkit = floorCompatToolkit_;
const floorLodashEs = floorLodashEs_;
const floorTaphos = floorTaphos_;

describe('floor', () => {
  bench('es-toolkit/compat/floor', () => {
    floorCompatToolkit(4.006);
    floorCompatToolkit(4.006, 0);
    floorCompatToolkit(4.016, 2);
    floorCompatToolkit(4.1, 2);
    floorCompatToolkit(4.4, 2);
    floorCompatToolkit(4160, -2);
    floorCompatToolkit(4.006, NaN);
    floorCompatToolkit(4.016, 2.6);
    floorCompatToolkit(5e1, 2);
  });

  bench('lodash-es/floor', () => {
    floorLodashEs(4.006);
    floorLodashEs(4.006, 0);
    floorLodashEs(4.016, 2);
    floorLodashEs(4.1, 2);
    floorLodashEs(4.4, 2);
    floorLodashEs(4160, -2);
    floorLodashEs(4.006, NaN);
    floorLodashEs(4.016, 2.6);
    floorLodashEs(5e1, 2);
  });

  bench('taphos/floor', () => {
    floorTaphos(4.006);
    floorTaphos(4.006, 0);
    floorTaphos(4.016, 2);
    floorTaphos(4.1, 2);
    floorTaphos(4.4, 2);
    floorTaphos(4160, -2);
    floorTaphos(4.006, NaN);
    floorTaphos(4.016, 2.6);
    floorTaphos(5e1, 2);
  });

  bench('native/floor', () => {
    Math.floor(4.006);
    Math.floor(4.006);
    Math.floor(4.016 * 100) / 100;
    Math.floor(4.1 * 100) / 100;
    Math.floor(4.4 * 100) / 100;
    Math.floor(4160 / 100) * 100;
    Math.floor(4.006);
    Math.floor(4.016 * 100) / 100;
    Math.floor(5e1 * 100) / 100;
  });
});
