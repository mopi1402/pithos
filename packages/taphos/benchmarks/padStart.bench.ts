// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { padStart as padStartCompatToolkit_ } from 'es-toolkit/compat';
import { padStart as padStartLodashEs_ } from 'lodash-es';
import { padStart as padStartTaphos_ } from '../../pithos/src/taphos/string/padStart';

const padStartCompatToolkit = padStartCompatToolkit_;
const padStartLodashEs = padStartLodashEs_;
const padStartTaphos = padStartTaphos_;

describe('padStart', () => {
  bench('es-toolkit/compat/padStart', () => {
    const str = 'abc';
        padStartCompatToolkit(str, 6, '_-');
  });

  bench('lodash-es/padStart', () => {
    const str = 'abc';
        padStartLodashEs(str, 6, '_-');
  });

  bench('taphos/padStart', () => {
    const str = 'abc';
        padStartTaphos(str, 6, '_-');
  });

  bench('native/padStart', () => {
    const str = 'abc';
    str.padStart(6, '_-');
  });
});
