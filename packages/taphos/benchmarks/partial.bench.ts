// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
// FIXED: Original benchmark only tested function creation, not invocation
import { bench, describe } from 'vitest';
import { partial as partialToolkit_ } from 'es-toolkit';
import { partial as partialCompatToolkit_ } from 'es-toolkit/compat';
import { partial as partialLodashEs_ } from 'lodash-es';
import { partial as partialTaphos_ } from '../../pithos/src/taphos/function/partial';

const partialToolkit = partialToolkit_;
const partialCompatToolkit = partialCompatToolkit_;
const partialLodashEs = partialLodashEs_;
const partialTaphos = partialTaphos_;

function fn(a: unknown, b: unknown, c: unknown) {
  return [a, b, c];
}

describe('partial', () => {
  bench('es-toolkit/partial', () => {
    const partialFn = partialToolkit(fn, 'a');
    partialFn('b', 'c');
  });

  bench('es-toolkit/compat/partial', () => {
    const partialFn = partialCompatToolkit(fn, 'a');
    partialFn('b', 'c');
  });

  bench('lodash-es/partial', () => {
    const partialFn = partialLodashEs(fn, 'a');
    partialFn('b', 'c');
  });

  bench('taphos/partial', () => {
    const partialFn = partialTaphos(fn, 'a');
    partialFn('b', 'c');
  });

  bench('native/partial', () => {
    const partialFn = fn.bind(null, 'a');
    partialFn('b', 'c');
  });
});
