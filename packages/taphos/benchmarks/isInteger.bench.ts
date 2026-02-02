// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { isInteger as isIntegerCompatToolkit_ } from 'es-toolkit/compat';
import { isInteger as isIntegerLodashEs_ } from 'lodash-es';
import { isInteger as isIntegerTaphos_ } from '../../pithos/src/taphos/lang/isInteger';

const isIntegerCompatToolkit = isIntegerCompatToolkit_;
const isIntegerLodashEs = isIntegerLodashEs_;
const isIntegerTaphos = isIntegerTaphos_;

describe('isInteger', () => {
  bench('es-toolkit/compat/isInteger', () => {
    const vals = [1, 1.1, '1', [], {}, () => false, Infinity];
        for (let i = 0; i < vals.length; i++) {
          isIntegerCompatToolkit(vals[i]);
        }
  });

  bench('lodash-es/isInteger', () => {
    const vals = [1, 1.1, '1', [], {}, () => false, Infinity];
        for (let i = 0; i < vals.length; i++) {
          isIntegerLodashEs(vals[i]);
        }
  });

  bench('taphos/isInteger', () => {
    const vals = [1, 1.1, '1', [], {}, () => false, Infinity];
        for (let i = 0; i < vals.length; i++) {
          isIntegerTaphos(vals[i]);
        }
  });

  bench('native/isInteger', () => {
    const vals = [1, 1.1, '1', [], {}, () => false, Infinity];
    for (let i = 0; i < vals.length; i++) {
      Number.isInteger(vals[i]);
    }
  });
});
