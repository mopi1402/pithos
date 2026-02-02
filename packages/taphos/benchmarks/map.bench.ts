// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { map as mapCompatToolkit_ } from 'es-toolkit/compat';
import { map as mapLodashEs_ } from 'lodash-es';
import { map as mapTaphos_ } from '../../pithos/src/taphos/collection/map';

const mapCompatToolkit = mapCompatToolkit_;
const mapLodashEs = mapLodashEs_;
const mapTaphos = mapTaphos_;

const generateArray = (length: number) => Array.from({ length }, (_, i) => i);

describe('map/array', () => {
  const array = [1, 2, 3, 4, 5];

  bench('es-toolkit/compat/map', () => {
    mapCompatToolkit(array, value => value * 2);
  });

  bench('lodash-es/map', () => {
    mapLodashEs(array, value => value * 2);
  });

  bench('taphos/map', () => {
    mapTaphos(array, value => value * 2);
  });

  bench('native/map', () => {
    array.map(value => value * 2);
  });
});

describe('map/largeArray', () => {
  const largeArray = generateArray(10000);

  bench('es-toolkit/compat/map', () => {
    mapCompatToolkit(largeArray, value => value * 2);
  });

  bench('lodash-es/map', () => {
    mapLodashEs(largeArray, value => value * 2);
  });

  bench('taphos/map', () => {
    mapTaphos(largeArray, value => value * 2);
  });

  bench('native/map', () => {
    largeArray.map(value => value * 2);
  });
});
