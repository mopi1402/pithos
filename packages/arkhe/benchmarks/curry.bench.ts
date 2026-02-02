// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { curry as curryToolkit_ } from 'es-toolkit';
import { curry as curryCompatToolkit_ } from 'es-toolkit/compat';
import { curry as curryLodashEs_ } from 'lodash-es';
import { curry as curryArkhe_ } from '../../pithos/src/arkhe/function/curry';

const curryToolkit = curryToolkit_;
const curryCompatToolkit = curryCompatToolkit_;
const curryLodashEs = curryLodashEs_;
const curryArkhe = curryArkhe_;

describe('curry', () => {
  const fn = (a: number, b: string, c: boolean) => ({ a, b, c });

  bench('es-toolkit/curry', () => {
    curryToolkit(fn)(1)('a')(true);
  });

  bench('es-toolkit/compat/curry', () => {
    curryCompatToolkit(fn)(1)('a')(true);
  });

  bench('lodash-es/curry', () => {
    curryLodashEs(fn)(1)('a')(true);
  });

  bench('arkhe/curry', () => {
    curryArkhe(fn)(1)('a')(true);
  });
});
