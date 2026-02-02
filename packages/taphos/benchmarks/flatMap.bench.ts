// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { flatMap as flatMapToolkit_ } from 'es-toolkit';
import { flatMap as flatMapCompatToolkit_ } from 'es-toolkit/compat';
import { flatMap as flatMapLodashEs_ } from 'lodash-es';
import { flatMap as flatMapTaphos_ } from '../../pithos/src/taphos/collection/flatMap';

const flatMapToolkit = flatMapToolkit_;
const flatMapCompatToolkit = flatMapCompatToolkit_;
const flatMapLodashEs = flatMapLodashEs_;
const flatMapTaphos = flatMapTaphos_;

describe('flatMap', () => {
  const iteratee = (item: number) => [item, item, item];
  const arr = Array.from({ length: 30 }, (_, i) => i);

  bench('es-toolkit/flatMap', () => {
    flatMapToolkit(arr, iteratee);
  });

  bench('es-toolkit/compat/flatMap', () => {
    flatMapCompatToolkit(arr, iteratee);
  });

  bench('lodash-es/flatMap', () => {
    flatMapLodashEs(arr, iteratee);
  });

  bench('taphos/flatMap', () => {
    flatMapTaphos(arr, iteratee);
  });

  bench('native/flatMap', () => {
    arr.flatMap(iteratee);
  });
});
