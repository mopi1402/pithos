// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { round as roundToolkit_ } from 'es-toolkit';
import { round as roundCompatToolkit_ } from 'es-toolkit/compat';
import { round as roundLodashEs_ } from 'lodash-es';
import { round as roundTaphos_ } from '../../pithos/src/taphos/math/round';

const roundToolkit = roundToolkit_;
const roundCompatToolkit = roundCompatToolkit_;
const roundLodashEs = roundLodashEs_;
const roundTaphos = roundTaphos_;

describe('round', () => {
  bench('es-toolkit/round', () => {
    roundToolkit(1.2345, 2);
  });

  bench('es-toolkit/compat/round', () => {
    roundCompatToolkit(1.2345, 2);
  });

  bench('lodash-es/round', () => {
    roundLodashEs(1.2345, 2);
  });

  bench('taphos/round', () => {
    roundTaphos(1.2345, 2);
  });

  bench('native/round', () => {
    Math.round(1.2345 * 100) / 100;
  });
});

describe('round/compat', () => {
  bench('es-toolkit/compat/round', () => {
    roundCompatToolkit(4.006);
    roundCompatToolkit(4.006, 0);
    roundCompatToolkit(4.016, 2);
    roundCompatToolkit(4.1, 2);
    roundCompatToolkit(4.4, 2);
    roundCompatToolkit(4160, -2);
    roundCompatToolkit(4.006, NaN);
    roundCompatToolkit(4.016, 2.6);
    roundCompatToolkit(5e1, 2);
  });

  bench('lodash-es/round', () => {
    roundLodashEs(4.006);
    roundLodashEs(4.006, 0);
    roundLodashEs(4.016, 2);
    roundLodashEs(4.1, 2);
    roundLodashEs(4.4, 2);
    roundLodashEs(4160, -2);
    roundLodashEs(4.006, NaN);
    roundLodashEs(4.016, 2.6);
    roundLodashEs(5e1, 2);
  });

  bench('taphos/round', () => {
    roundTaphos(4.006);
    roundTaphos(4.006, 0);
    roundTaphos(4.016, 2);
    roundTaphos(4.1, 2);
    roundTaphos(4.4, 2);
    roundTaphos(4160, -2);
    roundTaphos(4.006, NaN);
    roundTaphos(4.016, 2.6);
    roundTaphos(5e1, 2);
  });

  bench('native/round', () => {
    Math.round(4.006);
    Math.round(4.006);
    Math.round(4.016 * 100) / 100;
    Math.round(4.1 * 100) / 100;
    Math.round(4.4 * 100) / 100;
    Math.round(4160 / 100) * 100;
    Math.round(4.006);
    Math.round(4.016 * 100) / 100;
    Math.round(5e1 * 100) / 100;
  });
});
