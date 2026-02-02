// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { isBuffer as isBufferToolkit_ } from 'es-toolkit';
import { isBuffer as isBufferCompatToolkit_ } from 'es-toolkit/compat';
import { isBuffer as isBufferLodashEs_ } from 'lodash-es';
import { isBuffer as isBufferTaphos_ } from '../../pithos/src/taphos/lang/isBuffer';

const isBufferToolkit = isBufferToolkit_;
const isBufferCompatToolkit = isBufferCompatToolkit_;
const isBufferLodashEs = isBufferLodashEs_;
const isBufferTaphos = isBufferTaphos_;

describe('isBuffer', () => {
  bench('es-toolkit/isBuffer', () => {
    isBufferToolkit(Buffer.from('test'));
  });

  bench('es-toolkit/compat/isBuffer', () => {
    isBufferCompatToolkit(Buffer.from('test'));
  });

  bench('lodash-es/isBuffer', () => {
    isBufferLodashEs(Buffer.from('test'));
  });

  bench('taphos/isBuffer', () => {
    isBufferTaphos(Buffer.from('test'));
  });

  bench('native/isBuffer', () => {
    Buffer.isBuffer(Buffer.from('test'));
  });
});
