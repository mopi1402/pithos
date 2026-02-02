// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { split as splitCompatToolkit_ } from 'es-toolkit/compat';
import { split as splitLodashEs_ } from 'lodash-es';
import { split as splitTaphos_ } from '../../pithos/src/taphos/string/split';

const splitCompatToolkit = splitCompatToolkit_;
const splitLodashEs = splitLodashEs_;
const splitTaphos = splitTaphos_;

describe('split', () => {
  const str = 'a-b-c-d-e-f-g-h-i-j-k-l-m-n-o-p-q-r-s-t-u-v-w-x-y-z';

  bench('es-toolkit/compat/split', () => {
    splitCompatToolkit(str, '-');
  });

  bench('lodash-es/split', () => {
    splitLodashEs(str, '-');
  });

  bench('taphos/split', () => {
    splitTaphos(str, '-');
  });

  bench('native/split', () => {
    str.split('-');
  });
});
