// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { toArray as toArrayCompatToolkit_ } from 'es-toolkit/compat';
import { toArray as toArrayLodashEs_ } from 'lodash-es';
import { toArray as toArrayArkhe_ } from '../../pithos/src/arkhe/array/to-array';

const toArrayCompatToolkit = toArrayCompatToolkit_;
const toArrayLodashEs = toArrayLodashEs_;
const toArrayArkhe = toArrayArkhe_;

describe('toArray', () => {
  bench('es-toolkit/compat/toArray', () => {
    toArrayCompatToolkit({ a: 1, b: 2 });
        toArrayCompatToolkit('abc');
        toArrayCompatToolkit(1);
        toArrayCompatToolkit(null);
        toArrayCompatToolkit(
          new Map([
            ['a', 1],
            ['b', 2],
          ])
        );
  });

  bench('lodash-es/toArray', () => {
    toArrayLodashEs({ a: 1, b: 2 });
        toArrayLodashEs('abc');
        toArrayLodashEs(1);
        toArrayLodashEs(null);
        toArrayLodashEs(
          new Map([
            ['a', 1],
            ['b', 2],
          ])
        );
  });

  bench('arkhe/toArray', () => {
    toArrayArkhe({ a: 1, b: 2 });
        toArrayArkhe('abc');
        toArrayArkhe(1);
        toArrayArkhe(null);
        toArrayArkhe(
          new Map([
            ['a', 1],
            ['b', 2],
          ])
        );
  });
});
