// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { padEnd as padEndCompatToolkit_ } from 'es-toolkit/compat';
import { padEnd as padEndLodashEs_ } from 'lodash-es';
import { padEnd as padEndTaphos_ } from '../../pithos/src/taphos/string/padEnd';

const padEndCompatToolkit = padEndCompatToolkit_;
const padEndLodashEs = padEndLodashEs_;
const padEndTaphos = padEndTaphos_;

describe('padEnd', () => {
  bench('es-toolkit/compat/padEnd', () => {
    const str = 'abc';
        padEndCompatToolkit(str, 6, '_-');
  });

  bench('lodash-es/padEnd', () => {
    const str = 'abc';
        padEndLodashEs(str, 6, '_-');
  });

  bench('taphos/padEnd', () => {
    const str = 'abc';
        padEndTaphos(str, 6, '_-');
  });

  bench('native/padEnd', () => {
    const str = 'abc';
    str.padEnd(6, '_-');
  });
});
