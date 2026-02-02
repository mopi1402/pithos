// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { indexOf as indexOfCompatToolkit_ } from 'es-toolkit/compat';
import { indexOf as indexOfLodashEs_ } from 'lodash-es';
import { indexOf as indexOfTaphos_ } from '../../pithos/src/taphos/array/indexOf';

const indexOfCompatToolkit = indexOfCompatToolkit_;
const indexOfLodashEs = indexOfLodashEs_;
const indexOfTaphos = indexOfTaphos_;

describe('indexOf', () => {
  const array = [1, 2, 3, 4, NaN, '1', '2', '3', '4', 'NaN'];

  bench('es-toolkit/compat/indexOf', () => {
    indexOfCompatToolkit(array, 3);
    indexOfCompatToolkit(array, NaN);
    indexOfCompatToolkit(array, '1');
    indexOfCompatToolkit(array, 'NaN', -5);
    indexOfCompatToolkit(array, 'NaN', -100);
  });

  bench('lodash-es/indexOf', () => {
    indexOfLodashEs(array, 3);
    indexOfLodashEs(array, NaN);
    indexOfLodashEs(array, '1');
    indexOfLodashEs(array, 'NaN', -5);
    indexOfLodashEs(array, 'NaN', -100);
  });

  bench('taphos/indexOf', () => {
    indexOfTaphos(array, 3);
    indexOfTaphos(array, NaN);
    indexOfTaphos(array, '1');
    indexOfTaphos(array, 'NaN', -5);
    indexOfTaphos(array, 'NaN', -100);
  });

  bench('native/indexOf', () => {
    array.indexOf(3);
    array.indexOf(NaN);
    array.indexOf('1');
    array.indexOf('NaN', -5);
    array.indexOf('NaN', -100);
  });
});
