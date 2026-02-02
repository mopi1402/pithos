// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { zipObject as zipObjectToolkit_ } from 'es-toolkit';
import { zipObject as zipObjectCompatToolkit_ } from 'es-toolkit/compat';
import { zipObject as zipObjectLodashEs_ } from 'lodash-es';
import { zipObject as zipObjectTaphos_ } from '../../pithos/src/taphos/array/zipObject';

const zipObjectToolkit = zipObjectToolkit_;
const zipObjectCompatToolkit = zipObjectCompatToolkit_;
const zipObjectLodashEs = zipObjectLodashEs_;
const zipObjectTaphos = zipObjectTaphos_;

describe('zipObject', () => {
  bench('es-toolkit/zipObject', () => {
    zipObjectToolkit([1, 2, 3, 4], ['a', 'b', 'c', 'd']);
  });

  bench('es-toolkit/compat/zipObject', () => {
    zipObjectCompatToolkit([1, 2, 3, 4], ['a', 'b', 'c', 'd']);
  });

  bench('lodash-es/zipObject', () => {
    zipObjectLodashEs([1, 2, 3, 4], ['a', 'b', 'c', 'd']);
  });

  bench('taphos/zipObject', () => {
    zipObjectTaphos([1, 2, 3, 4], ['a', 'b', 'c', 'd']);
  });

  bench('native/zipObject', () => {
    const keys = [1, 2, 3, 4];
    const values = ['a', 'b', 'c', 'd'];
    Object.fromEntries(keys.map((k, i) => [k, values[i]]));
  });
});

describe('zipObject/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);

  bench('es-toolkit/zipObject', () => {
    zipObjectToolkit(largeArray, largeArray);
  });

  bench('es-toolkit/compat/zipObject', () => {
    zipObjectCompatToolkit(largeArray, largeArray);
  });

  bench('lodash-es/zipObject', () => {
    zipObjectLodashEs(largeArray, largeArray);
  });

  bench('taphos/zipObject', () => {
    zipObjectTaphos(largeArray, largeArray);
  });

  bench('native/zipObject', () => {
    Object.fromEntries(largeArray.map((k, i) => [k, largeArray[i]]));
  });
});
