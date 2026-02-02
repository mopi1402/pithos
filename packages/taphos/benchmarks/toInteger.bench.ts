// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { toInteger as toIntegerCompatToolkit_ } from 'es-toolkit/compat';
import { toInteger as toIntegerLodashEs_ } from 'lodash-es';
import { toInteger as toIntegerTaphos_ } from '../../pithos/src/taphos/lang/toInteger';

const toIntegerCompatToolkit = toIntegerCompatToolkit_;
const toIntegerLodashEs = toIntegerLodashEs_;
const toIntegerTaphos = toIntegerTaphos_;

describe('toInteger', () => {
  bench('es-toolkit/compat/toInteger', () => {
    toIntegerCompatToolkit({ valueOf: () => 1 });
        toIntegerCompatToolkit({ valueOf: () => 2 });
        toIntegerCompatToolkit({ toString: () => '3' });
        toIntegerCompatToolkit('0b101010');
        toIntegerCompatToolkit('0o12345');
        toIntegerCompatToolkit('0x1a2b3c');
        toIntegerCompatToolkit('1.1');
  });

  bench('lodash-es/toInteger', () => {
    toIntegerLodashEs({ valueOf: () => 1 });
        toIntegerLodashEs({ valueOf: () => 2 });
        toIntegerLodashEs({ toString: () => '3' });
        toIntegerLodashEs('0b101010');
        toIntegerLodashEs('0o12345');
        toIntegerLodashEs('0x1a2b3c');
        toIntegerLodashEs('1.1');
  });

  bench('taphos/toInteger', () => {
    toIntegerTaphos({ valueOf: () => 1 });
        toIntegerTaphos({ valueOf: () => 2 });
        toIntegerTaphos({ toString: () => '3' });
        toIntegerTaphos('0b101010');
        toIntegerTaphos('0o12345');
        toIntegerTaphos('0x1a2b3c');
        toIntegerTaphos('1.1');
  });

  bench('native/toInteger', () => {
    Math.trunc(Number({ valueOf: () => 1 }));
    Math.trunc(Number({ valueOf: () => 2 }));
    Math.trunc(Number({ toString: () => '3' }));
    Math.trunc(Number('0b101010'));
    Math.trunc(Number('0o12345'));
    Math.trunc(Number('0x1a2b3c'));
    Math.trunc(Number('1.1'));
  });
});
