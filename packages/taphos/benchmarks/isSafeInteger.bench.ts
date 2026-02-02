// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { isSafeInteger as isSafeIntegerCompatToolkit_ } from 'es-toolkit/compat';
import { isSafeInteger as isSafeIntegerLodashEs_ } from 'lodash-es';
import { isSafeInteger as isSafeIntegerTaphos_ } from '../../pithos/src/taphos/lang/isSafeInteger';

const isSafeIntegerCompatToolkit = isSafeIntegerCompatToolkit_;
const isSafeIntegerLodashEs = isSafeIntegerLodashEs_;
const isSafeIntegerTaphos = isSafeIntegerTaphos_;

describe('after', () => {
  bench('es-toolkit/compat/isSafeInteger', () => {
    const vals = [1, 1.1, '1', [], {}, () => false, Infinity, Number.MAX_SAFE_INTEGER + 1, Number.MIN_SAFE_INTEGER - 1];
        for (let i = 0; i < vals.length; i++) {
          isSafeIntegerCompatToolkit(vals[i]);
        }
  });

  bench('lodash-es/isSafeInteger', () => {
    const vals = [1, 1.1, '1', [], {}, () => false, Infinity, Number.MAX_SAFE_INTEGER + 1, Number.MIN_SAFE_INTEGER - 1];
        for (let i = 0; i < vals.length; i++) {
          isSafeIntegerLodashEs(vals[i]);
        }
  });

  bench('taphos/isSafeInteger', () => {
    const vals = [1, 1.1, '1', [], {}, () => false, Infinity, Number.MAX_SAFE_INTEGER + 1, Number.MIN_SAFE_INTEGER - 1];
        for (let i = 0; i < vals.length; i++) {
          isSafeIntegerTaphos(vals[i]);
        }
  });

  bench('native/isSafeInteger', () => {
    const vals = [1, 1.1, '1', [], {}, () => false, Infinity, Number.MAX_SAFE_INTEGER + 1, Number.MIN_SAFE_INTEGER - 1];
    for (let i = 0; i < vals.length; i++) {
      Number.isSafeInteger(vals[i]);
    }
  });
});
