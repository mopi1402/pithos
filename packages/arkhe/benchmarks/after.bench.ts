// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { after as afterToolkit_ } from 'es-toolkit';
import { after as afterCompatToolkit_ } from 'es-toolkit/compat';
import { after as afterLodashEs_ } from 'lodash-es';
import { after as afterArkhe_ } from '../../pithos/src/arkhe/function/after';

const afterToolkit = afterToolkit_;
const afterCompatToolkit = afterCompatToolkit_;
const afterLodashEs = afterLodashEs_;
const afterArkhe = afterArkhe_;

describe('after', () => {
  bench('es-toolkit/after', () => {
    const add = (a: number, b: number) => a + b;
        const n = 10;
        const afterFn = afterToolkit(n, add);
        for (let i = 0; i < n + 1; i++) {
          afterFn(1, 2);
        }
  });

  bench('es-toolkit/compat/after', () => {
    const add = (a: number, b: number) => a + b;
        const n = 10;
        const afterFn = afterCompatToolkit(n, add);
        for (let i = 0; i < n + 1; i++) {
          afterFn(1, 2);
        }
  });

  bench('lodash-es/after', () => {
    const add = (a: number, b: number) => a + b;
        const n = 10;
        const afterFn = afterLodashEs(n, add);
        for (let i = 0; i < n + 1; i++) {
          afterFn(1, 2);
        }
  });

  bench('arkhe/after', () => {
    const add = (a: number, b: number) => a + b;
    const n = 10;
    // Arkhe uses data-first: after(func, n) instead of after(n, func)
    const afterFn = afterArkhe(add, n);
    for (let i = 0; i < n + 1; i++) {
      afterFn(1, 2);
    }
  });
});
