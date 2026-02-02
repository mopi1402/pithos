// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
// Note: taphos includes only supports arrays and objects, not strings
import { bench, describe } from 'vitest';
import { includes as includesCompatToolkit_ } from 'es-toolkit/compat';
import { includes as includesLodashEs_ } from 'lodash-es';
import { includes as includesTaphos_ } from '../../pithos/src/taphos/collection/includes';

const includesCompatToolkit = includesCompatToolkit_;
const includesLodashEs = includesLodashEs_;
const includesTaphos = includesTaphos_;

describe('includes/array', () => {
  const array = [1, 'a', NaN, undefined, null, Infinity, Symbol('sym1'), -0];

  bench('es-toolkit/compat/includes', () => {
    includesCompatToolkit(array, 1);
    includesCompatToolkit(array, 'a');
    includesCompatToolkit(array, NaN);
    includesCompatToolkit(array, undefined);
    includesCompatToolkit(array, null);
    includesCompatToolkit(array, Infinity);
    includesCompatToolkit(array, -0);
  });

  bench('lodash-es/includes', () => {
    includesLodashEs(array, 1);
    includesLodashEs(array, 'a');
    includesLodashEs(array, NaN);
    includesLodashEs(array, undefined);
    includesLodashEs(array, null);
    includesLodashEs(array, Infinity);
    includesLodashEs(array, -0);
  });

  bench('taphos/includes', () => {
    includesTaphos(array, 1);
    includesTaphos(array, 'a');
    includesTaphos(array, NaN);
    includesTaphos(array, undefined);
    includesTaphos(array, null);
    includesTaphos(array, Infinity);
    includesTaphos(array, -0);
  });

  bench('native/includes', () => {
    array.includes(1);
    array.includes('a');
    array.includes(NaN);
    array.includes(undefined);
    array.includes(null);
    array.includes(Infinity);
    array.includes(-0);
  });
});

describe('includes/string', () => {
  const string = 'abcdefg';

  // Note: taphos includes does not support strings, only arrays and objects
  bench('es-toolkit/compat/includes', () => {
    includesCompatToolkit(string, 'bc');
    includesCompatToolkit(string, 'd');
  });

  bench('lodash-es/includes', () => {
    includesLodashEs(string, 'bc');
    includesLodashEs(string, 'd');
  });

  bench('native/includes', () => {
    string.includes('bc');
    string.includes('d');
  });
});
