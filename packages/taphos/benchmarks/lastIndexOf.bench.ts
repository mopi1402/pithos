// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { lastIndexOf as lastIndexOfCompatToolkit_ } from 'es-toolkit/compat';
import { lastIndexOf as lastIndexOfLodashEs_ } from 'lodash-es';
import { lastIndexOf as lastIndexOfTaphos_ } from '../../pithos/src/taphos/array/lastIndexOf';

const lastIndexOfCompatToolkit = lastIndexOfCompatToolkit_;
const lastIndexOfLodashEs = lastIndexOfLodashEs_;
const lastIndexOfTaphos = lastIndexOfTaphos_;

describe('lastIndexOf', () => {
  const largeArray = Array(10000)
    .fill(0)
    .map((_, i) => i);
  const array = [1, 2, 3, 4, NaN, '1', '2', '3', '4', 'NaN', ...largeArray];

  bench('es-toolkit/compat/lastIndexOf', () => {
    lastIndexOfCompatToolkit(array, 1);
    lastIndexOfCompatToolkit(array, NaN);
    lastIndexOfCompatToolkit(array, '1');
    lastIndexOfCompatToolkit(array, 'NaN', -5);
    lastIndexOfCompatToolkit(array, 'NaN', -100);
  });

  bench('lodash-es/lastIndexOf', () => {
    lastIndexOfLodashEs(array, 1);
    lastIndexOfLodashEs(array, NaN);
    lastIndexOfLodashEs(array, '1');
    lastIndexOfLodashEs(array, 'NaN', -5);
    lastIndexOfLodashEs(array, 'NaN', -100);
  });

  bench('taphos/lastIndexOf', () => {
    lastIndexOfTaphos(array, 1);
    lastIndexOfTaphos(array, NaN);
    lastIndexOfTaphos(array, '1');
    lastIndexOfTaphos(array, 'NaN', -5);
    lastIndexOfTaphos(array, 'NaN', -100);
  });

  bench('native/lastIndexOf', () => {
    array.lastIndexOf(1);
    array.lastIndexOf(NaN);
    array.lastIndexOf('1');
    array.lastIndexOf('NaN', -5);
    array.lastIndexOf('NaN', -100);
  });
});
