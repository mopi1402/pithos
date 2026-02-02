// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
// FIXED: Original benchmark only tested function creation, not invocation
import { bench, describe } from 'vitest';
import { spread as spreadToolkit_ } from 'es-toolkit';
import { spread as spreadCompatToolkit_ } from 'es-toolkit/compat';
import { spread as spreadLodashEs_ } from 'lodash-es';
import { spread as spreadTaphos_ } from '../../pithos/src/taphos/function/spread';

const spreadToolkit = spreadToolkit_;
const spreadCompatToolkit = spreadCompatToolkit_;
const spreadLodashEs = spreadLodashEs_;
const spreadTaphos = spreadTaphos_;

function fn(a: unknown, b: unknown, c: unknown) {
  return [a, b, c];
}

// taphos spread expects a function with signature (...args: unknown[]) => Result
function fnTaphos(...args: unknown[]) {
  return args;
}

const args: [string, string, string] = ['a', 'b', 'c'];

describe('spread', () => {
  bench('es-toolkit/spread', () => {
    const spreadFn = spreadToolkit(fn);
    spreadFn(args);
  });

  bench('es-toolkit/compat/spread', () => {
    const spreadFn = spreadCompatToolkit(fn);
    spreadFn(args);
  });

  bench('lodash-es/spread', () => {
    const spreadFn = spreadLodashEs(fn);
    spreadFn(args);
  });

  bench('taphos/spread', () => {
    const spreadFn = spreadTaphos(fnTaphos);
    spreadFn(args);
  });

  bench('native/spread', () => {
    // Native approach: use spread operator directly
    fn(...args);
  });
});
