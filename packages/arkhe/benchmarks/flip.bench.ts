// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { flip as flipCompatToolkit_ } from 'es-toolkit/compat';
import { flip as flipLodashEs_ } from 'lodash-es';
import { flip as flipArkhe_ } from '../../pithos/src/arkhe/function/flip';

const flipCompatToolkit = flipCompatToolkit_;
const flipLodashEs = flipLodashEs_;
const flipArkhe = flipArkhe_;

const fn = (a: number, b: string, c: boolean) => ({ a, b, c });

describe('flip', () => {
  bench('es-toolkit/compat/flip', () => {
    const flipped = flipCompatToolkit(fn);
    (flipped as any)(true, 'a', 1);
  });

  bench('lodash-es/flip', () => {
    const flipped = flipLodashEs(fn);
    (flipped as any)(true, 'a', 1);
  });

  bench('arkhe/flip', () => {
    const flipped = flipArkhe(fn);
    (flipped as any)(true, 'a', 1);
  });
});
