// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
// FIXED: Original benchmark only tested function creation, not invocation
// Note: unary creates a function that accepts only one argument
import { bench, describe } from 'vitest';
import { unary as unaryToolkit_ } from 'es-toolkit';
import { unary as unaryLodashEs_ } from 'lodash-es';
import { unary as unaryTaphos_ } from '../../pithos/src/taphos/function/unary';

const unaryToolkit = unaryToolkit_;
const unaryLodashEs = unaryLodashEs_;
const unaryTaphos = unaryTaphos_;

function fn(a: unknown, b: unknown, c: unknown) {
  return [a, b, c];
}

// taphos unary expects a function with signature (arg: unknown) => Result
function fnTaphos(a: unknown) {
  return [a];
}

describe('unary', () => {
  bench('es-toolkit/unary', () => {
    const unaryFn = unaryToolkit(fn);
    unaryFn('a');
  });

  bench('lodash-es/unary', () => {
    const unaryFn = unaryLodashEs(fn);
    unaryFn('a');
  });

  bench('taphos/unary', () => {
    const unaryFn = unaryTaphos(fnTaphos);
    unaryFn('a');
  });

  bench('native/unary', () => {
    // Native approach: use inline arrow function
    const unaryFn = (arg: unknown) => fn(arg, undefined, undefined);
    unaryFn('a');
  });
});
