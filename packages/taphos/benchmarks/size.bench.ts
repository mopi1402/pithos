// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
// Note: taphos size only supports arrays and objects, not strings, Set, or Map
import { bench, describe } from 'vitest';
import { size as sizeCompatToolkit_ } from 'es-toolkit/compat';
import { size as sizeLodashEs_ } from 'lodash-es';
import { size as sizeTaphos_ } from '../../pithos/src/taphos/collection/size';

const sizeCompatToolkit = sizeCompatToolkit_;
const sizeLodashEs = sizeLodashEs_;
const sizeTaphos = sizeTaphos_;

describe('size', () => {
  bench('es-toolkit/compat/size', () => {
    sizeCompatToolkit([1, 2, 3, 4]);
    sizeCompatToolkit('hello');
    sizeCompatToolkit({ a: 1, b: 2, c: 3 });
    sizeCompatToolkit([]);
    sizeCompatToolkit('');
    sizeCompatToolkit({});
    sizeCompatToolkit(new Set([1, 2, 3]));
    sizeCompatToolkit(
      new Map([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ])
    );
  });

  bench('lodash-es/size', () => {
    sizeLodashEs([1, 2, 3, 4]);
    sizeLodashEs('hello');
    sizeLodashEs({ a: 1, b: 2, c: 3 });
    sizeLodashEs([]);
    sizeLodashEs('');
    sizeLodashEs({});
    sizeLodashEs(new Set([1, 2, 3]));
    sizeLodashEs(
      new Map([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ])
    );
  });

  bench('taphos/size', () => {
    sizeTaphos([1, 2, 3, 4]);
    sizeTaphos({ a: 1, b: 2, c: 3 });
    sizeTaphos([]);
    sizeTaphos({});
  });

  bench('native/size', () => {
    [1, 2, 3, 4].length;
    Object.keys({ a: 1, b: 2, c: 3 }).length;
    [].length;
    Object.keys({}).length;
  });
});
