// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { upperFirst as upperFirstToolkit_ } from 'es-toolkit';
import { upperFirst as upperFirstCompatToolkit_ } from 'es-toolkit/compat';
import { upperFirst as upperFirstLodashEs_ } from 'lodash-es';
import { upperFirst as upperFirstTaphos_ } from '../../pithos/src/taphos/string/upperFirst';

const upperFirstToolkit = upperFirstToolkit_;
const upperFirstCompatToolkit = upperFirstCompatToolkit_;
const upperFirstLodashEs = upperFirstLodashEs_;
const upperFirstTaphos = upperFirstTaphos_;

describe('upperFirst', () => {
  bench('es-toolkit/upperFirst', () => {
    const str = 'camelCase';
          upperFirstToolkit(str);
  });

  bench('es-toolkit/compat/upperFirst', () => {
    const str = 'camelCase';
          upperFirstCompatToolkit(str);
  });

  bench('lodash-es/upperFirst', () => {
    const str = 'camelCase';
          upperFirstLodashEs(str);
  });

  bench('taphos/upperFirst', () => {
    const str = 'camelCase';
          upperFirstTaphos(str);
  });

  bench('native/upperFirst', () => {
    const str = 'camelCase';
    str.charAt(0).toUpperCase() + str.slice(1);
  });
});
