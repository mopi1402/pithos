// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { isFinite as isFiniteCompatToolkit_ } from 'es-toolkit/compat';
import { isFinite as isFiniteLodashEs_ } from 'lodash-es';
import { isFinite as isFiniteTaphos_ } from '../../pithos/src/taphos/lang/isFinite';

const isFiniteCompatToolkit = isFiniteCompatToolkit_;
const isFiniteLodashEs = isFiniteLodashEs_;
const isFiniteTaphos = isFiniteTaphos_;

describe('isFinite', () => {
  bench('es-toolkit/compat/isFinite', () => {
    isFiniteCompatToolkit(1);
        isFiniteCompatToolkit(1.12);
        isFiniteCompatToolkit(Infinity);
        isFiniteCompatToolkit(-Infinity);
        isFiniteCompatToolkit([]);
        isFiniteCompatToolkit({});
        isFiniteCompatToolkit('1');
  });

  bench('lodash-es/isFinite', () => {
    isFiniteLodashEs(1);
        isFiniteLodashEs(1.12);
        isFiniteLodashEs(Infinity);
        isFiniteLodashEs(-Infinity);
        isFiniteLodashEs([]);
        isFiniteLodashEs({});
        isFiniteLodashEs('1');
  });

  bench('taphos/isFinite', () => {
    isFiniteTaphos(1);
        isFiniteTaphos(1.12);
        isFiniteTaphos(Infinity);
        isFiniteTaphos(-Infinity);
        isFiniteTaphos([]);
        isFiniteTaphos({});
        isFiniteTaphos('1');
  });

  bench('native/isFinite', () => {
    Number.isFinite(1);
    Number.isFinite(1.12);
    Number.isFinite(Infinity);
    Number.isFinite(-Infinity);
    Number.isFinite([]);
    Number.isFinite({});
    Number.isFinite('1');
  });
});
