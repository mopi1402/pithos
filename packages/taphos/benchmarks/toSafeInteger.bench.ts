// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { toSafeInteger as toSafeIntegerCompatToolkit_ } from 'es-toolkit/compat';
import { toSafeInteger as toSafeIntegerLodashEs_ } from 'lodash-es';
import { toSafeInteger as toSafeIntegerTaphos_ } from '../../pithos/src/taphos/lang/toSafeInteger';

const toSafeIntegerCompatToolkit = toSafeIntegerCompatToolkit_;
const toSafeIntegerLodashEs = toSafeIntegerLodashEs_;
const toSafeIntegerTaphos = toSafeIntegerTaphos_;

describe('toSafeInteger', () => {
  bench('es-toolkit/compat/toSafeInteger', () => {
    toSafeIntegerCompatToolkit({ valueOf: () => 1 });
        toSafeIntegerCompatToolkit({ valueOf: () => 2 });
        toSafeIntegerCompatToolkit({ toString: () => '3' });
        toSafeIntegerCompatToolkit('0b101010');
        toSafeIntegerCompatToolkit('0o12345');
        toSafeIntegerCompatToolkit('0x1a2b3c');
        toSafeIntegerCompatToolkit('1.1');
  });

  bench('lodash-es/toSafeInteger', () => {
    toSafeIntegerLodashEs({ valueOf: () => 1 });
        toSafeIntegerLodashEs({ valueOf: () => 2 });
        toSafeIntegerLodashEs({ toString: () => '3' });
        toSafeIntegerLodashEs('0b101010');
        toSafeIntegerLodashEs('0o12345');
        toSafeIntegerLodashEs('0x1a2b3c');
        toSafeIntegerLodashEs('1.1');
  });

  bench('taphos/toSafeInteger', () => {
    toSafeIntegerTaphos({ valueOf: () => 1 });
        toSafeIntegerTaphos({ valueOf: () => 2 });
        toSafeIntegerTaphos({ toString: () => '3' });
        toSafeIntegerTaphos('0b101010');
        toSafeIntegerTaphos('0o12345');
        toSafeIntegerTaphos('0x1a2b3c');
        toSafeIntegerTaphos('1.1');
  });

  bench('native/toSafeInteger', () => {
    const toSafeIntegerNative = (value: unknown): number => {
      const n = Math.trunc(Number(value));
      return Math.max(Number.MIN_SAFE_INTEGER, Math.min(Number.MAX_SAFE_INTEGER, n));
    };
    toSafeIntegerNative({ valueOf: () => 1 });
    toSafeIntegerNative({ valueOf: () => 2 });
    toSafeIntegerNative({ toString: () => '3' });
    toSafeIntegerNative('0b101010');
    toSafeIntegerNative('0o12345');
    toSafeIntegerNative('0x1a2b3c');
    toSafeIntegerNative('1.1');
  });
});
