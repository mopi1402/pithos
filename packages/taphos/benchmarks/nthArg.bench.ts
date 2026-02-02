// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { nthArg as nthArgCompatToolkit_ } from 'es-toolkit/compat';
import { nthArg as nthArgLodashEs_ } from 'lodash-es';
import { nthArg as nthArgTaphos_ } from '../../pithos/src/taphos/util/nthArg';

const nthArgCompatToolkit = nthArgCompatToolkit_;
const nthArgLodashEs = nthArgLodashEs_;
const nthArgTaphos = nthArgTaphos_;

describe('nthArg', () => {
  const array = [1, 2, 3];
  const nativeNthArg = (n: number) => (...args: unknown[]) => {
    const index = n < 0 ? args.length + n : n;
    return args[index];
  };

  bench('es-toolkit/compat/nthArg', () => {
    nthArgCompatToolkit(0)(...array);
    nthArgCompatToolkit(-1)(...array);
  });

  bench('lodash-es/nthArg', () => {
    nthArgLodashEs(0)(...array);
    nthArgLodashEs(-1)(...array);
  });

  bench('taphos/nthArg', () => {
    nthArgTaphos(0)(...array);
    nthArgTaphos(-1)(...array);
  });

  bench('native/nthArg', () => {
    nativeNthArg(0)(...array);
    nativeNthArg(-1)(...array);
  });
});

describe('nthArg/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);

  bench('es-toolkit/compat/nthArg', () => {
    nthArgCompatToolkit(0)(...largeArray);
        nthArgCompatToolkit(-1)(...largeArray);
  });

  bench('lodash-es/nthArg', () => {
    nthArgLodashEs(0)(...largeArray);
        nthArgLodashEs(-1)(...largeArray);
  });

  bench('taphos/nthArg', () => {
    nthArgTaphos(0)(...largeArray);
        nthArgTaphos(-1)(...largeArray);
  });
});
