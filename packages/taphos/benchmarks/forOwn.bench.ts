// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { forOwn as forOwnCompatToolkit_ } from 'es-toolkit/compat';
import { forOwn as forOwnLodashEs_ } from 'lodash-es';
import { forOwn as forOwnTaphos_ } from '../../pithos/src/taphos/object/forOwn';

const forOwnCompatToolkit = forOwnCompatToolkit_;
const forOwnLodashEs = forOwnLodashEs_;
const forOwnTaphos = forOwnTaphos_;

describe('forOwn', () => {
  const obj = { a: 1, b: 2, c: 3 };
  const iteratee = (value: number, key: string, object: typeof obj) => [value, key, object];

  bench('es-toolkit/compat/forOwn', () => {
    forOwnCompatToolkit(obj, iteratee);
  });

  bench('lodash-es/forOwn', () => {
    forOwnLodashEs(obj, iteratee);
  });

  bench('taphos/forOwn', () => {
    forOwnTaphos(obj, iteratee);
  });

  bench('native/forOwn', () => {
    Object.keys(obj).forEach(key => {
      iteratee(obj[key as keyof typeof obj], key, obj);
    });
  });
});
