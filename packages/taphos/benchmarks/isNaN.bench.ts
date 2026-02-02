// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { isNaN as isNaNCompatToolkit_ } from 'es-toolkit/compat';
import { isNaN as isNaNLodashEs_ } from 'lodash-es';
import { isNaN as isNaNTaphos_ } from '../../pithos/src/taphos/lang/isNaN';

const isNaNCompatToolkit = isNaNCompatToolkit_;
const isNaNLodashEs = isNaNLodashEs_;
const isNaNTaphos = isNaNTaphos_;

describe('isNaN', () => {
  bench('es-toolkit/compat/isNaN', () => {
    isNaNCompatToolkit(NaN);
        isNaNCompatToolkit(1);
        isNaNCompatToolkit(null);
        isNaNCompatToolkit(undefined);
        isNaNCompatToolkit('NaN');
  });

  bench('lodash-es/isNaN', () => {
    isNaNLodashEs(NaN);
        isNaNLodashEs(1);
        isNaNLodashEs(null);
        isNaNLodashEs(undefined);
        isNaNLodashEs('NaN');
  });

  bench('taphos/isNaN', () => {
    isNaNTaphos(NaN);
        isNaNTaphos(1);
        isNaNTaphos(null);
        isNaNTaphos(undefined);
        isNaNTaphos('NaN');
  });

  bench('native/isNaN', () => {
    Number.isNaN(NaN);
    Number.isNaN(1);
    Number.isNaN(null);
    Number.isNaN(undefined);
    Number.isNaN('NaN');
  });
});
