// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { forIn as forInCompatToolkit_ } from 'es-toolkit/compat';
import { forIn as forInLodashEs_ } from 'lodash-es';
import { forIn as forInTaphos_ } from '../../pithos/src/taphos/object/forIn';

const forInCompatToolkit = forInCompatToolkit_;
const forInLodashEs = forInLodashEs_;
const forInTaphos = forInTaphos_;

describe('forIn', () => {
  const bigObject = Object.fromEntries(Array.from({ length: 1000 }, (_, i) => [String(i), i]));
  const iteratee = (value: number, key: string) => [value, key];

  bench('es-toolkit/compat/forIn', () => {
    forInCompatToolkit(bigObject, iteratee);
  });

  bench('lodash-es/forIn', () => {
    forInLodashEs(bigObject, iteratee);
  });

  bench('taphos/forIn', () => {
    forInTaphos(bigObject, iteratee);
  });

  bench('native/forIn', () => {
    for (const key in bigObject) {
      iteratee(bigObject[key], key);
    }
  });
});
