// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
// FIXED: Original benchmark had a test case that only measured function creation
import { bench, describe } from 'vitest';
import { wrap as wrapCompatToolkit_ } from 'es-toolkit/compat';
import { wrap as wrapLodashEs_ } from 'lodash-es';
import { wrap as wrapTaphos_ } from '../../pithos/src/taphos/function/wrap';

const wrapCompatToolkit = wrapCompatToolkit_;
const wrapLodashEs = wrapLodashEs_;
const wrapTaphos = wrapTaphos_;

describe('wrap', () => {
  bench('es-toolkit/compat/wrap', () => {
    const wrapped = wrapCompatToolkit(
      (x: string) => x.toUpperCase(),
      (value, x: string) => `<p>${value(x)}</p>`
    );
    wrapped('hello');
  });

  bench('lodash-es/wrap', () => {
    const wrapped = wrapLodashEs(
      (x: string) => x.toUpperCase(),
      (value, x: string) => `<p>${value(x)}</p>`
    );
    wrapped('hello');
  });

  bench('taphos/wrap', () => {
    const wrapped = wrapTaphos(
      (x: string) => x.toUpperCase(),
      (value, x: string) => `<p>${value(x)}</p>`
    );
    wrapped('hello');
  });

  bench('native/wrap', () => {
    // Native approach: use closure directly
    const toUpper = (x: string) => x.toUpperCase();
    const wrapped = (x: string) => `<p>${toUpper(x)}</p>`;
    wrapped('hello');
  });
});
