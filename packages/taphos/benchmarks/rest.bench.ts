// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
// FIXED: Original benchmark only tested function creation, not invocation
import { bench, describe } from 'vitest';
import { rest as restToolkit_ } from 'es-toolkit';
import { rest as restCompatToolkit_ } from 'es-toolkit/compat';
import { rest as restLodashEs_ } from 'lodash-es';
import { rest as restTaphos_ } from '../../pithos/src/taphos/function/rest';

const restToolkit = restToolkit_;
const restCompatToolkit = restCompatToolkit_;
const restLodashEs = restLodashEs_;
const restTaphos = restTaphos_;

function fn(a: unknown, b: unknown, rest: unknown[]) {
  return [a, b, ...rest];
}

// taphos rest expects a function with signature (...args: unknown[]) => Result
function fnTaphos(...args: unknown[]) {
  const [a, b, rest] = args;
  return [a, b, ...(rest as unknown[])];
}

describe('rest', () => {
  bench('es-toolkit/rest', () => {
    const restFn = restToolkit(fn, 2);
    restFn('a', 'b', 'c', 'd', 'e');
  });

  bench('es-toolkit/compat/rest', () => {
    const restFn = restCompatToolkit(fn, 2);
    restFn('a', 'b', 'c', 'd', 'e');
  });

  bench('lodash-es/rest', () => {
    const restFn = restLodashEs(fn, 2);
    restFn('a', 'b', 'c', 'd', 'e');
  });

  bench('taphos/rest', () => {
    const restFn = restTaphos(fnTaphos, 2);
    restFn('a', 'b', 'c', 'd', 'e');
  });

  bench('native/rest', () => {
    // Native approach: use rest parameters directly in function definition
    const restFn = (a: unknown, b: unknown, ...rest: unknown[]) => [a, b, ...rest];
    restFn('a', 'b', 'c', 'd', 'e');
  });
});
