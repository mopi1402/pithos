// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { pullAllBy as pullAllByCompatToolkit_ } from 'es-toolkit/compat';
import { pullAllBy as pullAllByLodashEs_ } from 'lodash-es';
import { pullAllBy as pullAllByTaphos_ } from '../../pithos/src/taphos/array/pullAllBy';

const pullAllByCompatToolkit = pullAllByCompatToolkit_;
const pullAllByLodashEs = pullAllByLodashEs_;
const pullAllByTaphos = pullAllByTaphos_;

describe('pullAllBy', () => {
  bench('es-toolkit/compat/pullAllBy', () => {
    const array = [{ x: 1 }, { x: 2 }, { x: 3 }, { x: 1 }, { x: 2 }, { x: 3 }];
    pullAllByCompatToolkit(array, [{ x: 1 }, { x: 3 }], 'x');
  });

  bench('lodash-es/pullAllBy', () => {
    const array = [{ x: 1 }, { x: 2 }, { x: 3 }, { x: 1 }, { x: 2 }, { x: 3 }];
    pullAllByLodashEs(array, [{ x: 1 }, { x: 3 }], 'x');
  });

  bench('taphos/pullAllBy', () => {
    const array = [{ x: 1 }, { x: 2 }, { x: 3 }, { x: 1 }, { x: 2 }, { x: 3 }];
    pullAllByTaphos(array, [{ x: 1 }, { x: 3 }], item => item.x);
  });

  bench('native/pullAllBy', () => {
    // Native immutable approach using differenceBy pattern
    const array = [{ x: 1 }, { x: 2 }, { x: 3 }, { x: 1 }, { x: 2 }, { x: 3 }];
    const values = [{ x: 1 }, { x: 3 }];
    const excludeSet = new Set(values.map(v => v.x));
    array.filter(item => !excludeSet.has(item.x));
  });
});
