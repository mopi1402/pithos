// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { rangeRight as rangeRightToolkit_ } from 'es-toolkit';
import { rangeRight as rangeRightCompatToolkit_ } from 'es-toolkit/compat';
import { rangeRight as rangeRightLodashEs_ } from 'lodash-es';
import { rangeRight as rangeRightTaphos_ } from '../../pithos/src/taphos/util/rangeRight';

const rangeRightToolkit = rangeRightToolkit_;
const rangeRightCompatToolkit = rangeRightCompatToolkit_;
const rangeRightLodashEs = rangeRightLodashEs_;
const rangeRightTaphos = rangeRightTaphos_;

describe('rangeRight', () => {
  bench('es-toolkit/rangeRight', () => {
    rangeRightToolkit(0, 100, 1);
  });

  bench('es-toolkit/compat/rangeRight', () => {
    rangeRightCompatToolkit(0, 100, 1);
  });

  bench('lodash-es/rangeRight', () => {
    rangeRightLodashEs(0, 100, 1);
  });

  bench('taphos/rangeRight', () => {
    rangeRightTaphos(0, 100, 1);
  });

  bench('native/rangeRight', () => {
    Array.from({ length: 100 }, (_, i) => i).reverse();
  });
});
