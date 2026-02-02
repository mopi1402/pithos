// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { before as beforeToolkit_ } from 'es-toolkit';
import { before as beforeCompatToolkit_ } from 'es-toolkit/compat';
import { before as beforeLodashEs_ } from 'lodash-es';
import { before as beforeArkhe_ } from '../../pithos/src/arkhe/function/before';

const beforeToolkit = beforeToolkit_;
const beforeCompatToolkit = beforeCompatToolkit_;
const beforeLodashEs = beforeLodashEs_;
const beforeArkhe = beforeArkhe_;

describe('before', () => {
  bench('es-toolkit/before', () => {
    const add = (a: number, b: number) => a + b;
    const n = 10;
    const beforeFn = beforeToolkit(10, add);
    for (let i = 0; i < n; i++) {
      beforeFn(1, 2);
    }
  }, { time: 100 });

  bench('es-toolkit/compat/before', () => {
    const add = (a: number, b: number) => a + b;
    const n = 10;
    const beforeFn = beforeCompatToolkit(10, add);
    for (let i = 0; i < n; i++) {
      beforeFn(1, 2);
    }
  }, { time: 100 });

  bench('lodash-es/before', () => {
    const add = (a: number, b: number) => a + b;
    const n = 10;
    const beforeFn = beforeLodashEs(10, add);
    for (let i = 0; i < n; i++) {
      beforeFn(1, 2);
    }
  }, { time: 100 });

  bench('arkhe/before', () => {
    const add = (a: number, b: number) => a + b;
    const n = 10;
    // Arkhe uses data-first: before(func, n) instead of before(n, func)
    const beforeFn = beforeArkhe(add, 10);
    for (let i = 0; i < n; i++) {
      beforeFn(1, 2);
    }
  }, { time: 100 });
});
