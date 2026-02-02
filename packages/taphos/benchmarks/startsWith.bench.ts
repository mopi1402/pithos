// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { startsWith as startsWithCompatToolkit_ } from 'es-toolkit/compat';
import { startsWith as startsWithLodashEs_ } from 'lodash-es';
import { startsWith as startsWithTaphos_ } from '../../pithos/src/taphos/string/startsWith';

const startsWithCompatToolkit = startsWithCompatToolkit_;
const startsWithLodashEs = startsWithLodashEs_;
const startsWithTaphos = startsWithTaphos_;

describe('startsWith', () => {
  bench('es-toolkit/compat/startsWith', () => {
    const str = 'fooBar';
        startsWithCompatToolkit(str, 'foo');
        startsWithCompatToolkit(str, 'Bar', 3);
  });

  bench('lodash-es/startsWith', () => {
    const str = 'fooBar';
        startsWithLodashEs(str, 'foo');
        startsWithLodashEs(str, 'Bar', 3);
  });

  bench('taphos/startsWith', () => {
    const str = 'fooBar';
        startsWithTaphos(str, 'foo');
        startsWithTaphos(str, 'Bar', 3);
  });

  bench('native/startsWith', () => {
    const str = 'fooBar';
    str.startsWith('foo');
    str.startsWith('Bar', 3);
  });
});
