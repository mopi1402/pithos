// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { random as randomToolkit_ } from 'es-toolkit';
import { random as randomCompatToolkit_ } from 'es-toolkit/compat';
import { random as randomLodashEs_ } from 'lodash-es';
import { random as randomArkhe_ } from '../../pithos/src/arkhe/number/random';

const randomToolkit = randomToolkit_;
const randomCompatToolkit = randomCompatToolkit_;
const randomLodashEs = randomLodashEs_;
const randomArkhe = randomArkhe_;

describe('random', () => {
  bench('es-toolkit/random', () => {
    randomToolkit(1, 10);
  });

  bench('es-toolkit/compat/random', () => {
    randomCompatToolkit(1, 10);
  });

  bench('lodash-es/random', () => {
    randomLodashEs(1, 10);
  });

  bench('arkhe/random', () => {
    randomArkhe(1, 10);
  });
});
