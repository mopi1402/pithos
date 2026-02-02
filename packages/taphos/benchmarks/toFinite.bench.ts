// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { toFinite as toFiniteCompatToolkit_ } from 'es-toolkit/compat';
import { toFinite as toFiniteLodashEs_ } from 'lodash-es';
import { toFinite as toFiniteTaphos_ } from '../../pithos/src/taphos/lang/toFinite';

const toFiniteCompatToolkit = toFiniteCompatToolkit_;
const toFiniteLodashEs = toFiniteLodashEs_;
const toFiniteTaphos = toFiniteTaphos_;

describe('toFinite', () => {
  bench('es-toolkit/compat/toFinite', () => {
    toFiniteCompatToolkit({ valueOf: () => 1 });
        toFiniteCompatToolkit({ valueOf: () => 2 });
        toFiniteCompatToolkit({ toString: () => '3' });
        toFiniteCompatToolkit('0b101010');
        toFiniteCompatToolkit('0o12345');
        toFiniteCompatToolkit('0x1a2b3c');
        toFiniteCompatToolkit('1.1');
  });

  bench('lodash-es/toFinite', () => {
    toFiniteLodashEs({ valueOf: () => 1 });
        toFiniteLodashEs({ valueOf: () => 2 });
        toFiniteLodashEs({ toString: () => '3' });
        toFiniteLodashEs('0b101010');
        toFiniteLodashEs('0o12345');
        toFiniteLodashEs('0x1a2b3c');
        toFiniteLodashEs('1.1');
  });

  bench('taphos/toFinite', () => {
    toFiniteTaphos({ valueOf: () => 1 });
        toFiniteTaphos({ valueOf: () => 2 });
        toFiniteTaphos({ toString: () => '3' });
        toFiniteTaphos('0b101010');
        toFiniteTaphos('0o12345');
        toFiniteTaphos('0x1a2b3c');
        toFiniteTaphos('1.1');
  });

  bench('native/toFinite', () => {
    const toFiniteNative = (value: unknown): number => {
      const n = Number(value);
      return Number.isFinite(n) ? n : (n > 0 ? Number.MAX_VALUE : (n < 0 ? -Number.MAX_VALUE : 0));
    };
    toFiniteNative({ valueOf: () => 1 });
    toFiniteNative({ valueOf: () => 2 });
    toFiniteNative({ toString: () => '3' });
    toFiniteNative('0b101010');
    toFiniteNative('0o12345');
    toFiniteNative('0x1a2b3c');
    toFiniteNative('1.1');
  });
});
